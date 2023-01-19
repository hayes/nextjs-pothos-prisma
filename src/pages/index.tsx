import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useMutation, useQuery } from 'urql';
import styles from "../styles/Home.module.css";
import { Todo } from "../types";
import {graphql} from '../gql'


const TodosQuery = graphql(/* GraphQL */`
  query getTodoList {
    todos {
      id
      text
      created
      completed
    }
  }
`);

const ToggleTodoMutation = graphql(/* GraphQL */`
  mutation toggleTodo($id: ID!, $completed: Boolean!) {
    updateTodo(
      id: $id
      completed: $completed
    ) {
      id
      text
      created
      completed
    }
  }
`);

const DeleteTodoMutation = graphql(/* GraphQL */`
  mutation deleteTodo($id: ID!) {
    deleteTodo(
      id: $id
    ) {
      id
    }
  }
`);

const CreateTodoMutation = graphql(/* GraphQL */`
  mutation createTodo($text: String!) {
    createTodo(
      text: $text
    ) {
      id
      text
      created
      completed
    }
  }
`);


export const TodoList: React.FC = () => {
  const [result] = useQuery({
    query: TodosQuery,
  });

  if (result.error) return <div>Error loading todos...</div>;

  const todos = result.data?.todos;

  if (!todos) return <div>Loading...</div>;

  if (todos.length === 0) {
    return <div className={styles.emptyState}>Try adding a todo ☝️️</div>;
  }

  return (
    <ul className={styles.todoList}>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [toggleState, toggleTodo] = useMutation(ToggleTodoMutation);
  const [deleteState, deleteTodo] = useMutation(DeleteTodoMutation);

  return (
  <li className={styles.todo}>
    <label
      className={`${styles.label} ${todo.completed ? styles.checked : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        className={`${styles.checkbox}`}
        onChange={() => toggleTodo({
          id: todo.id,
          completed: !todo.completed
        })}
      />
      {todo.text}
    </label>

    <button className={styles.deleteButton} onClick={() => deleteTodo({id: todo.id})}>
      ✕
    </button>
  </li>
)
};

const AddTodoInput = () => {
  const [createState, createTodo] = useMutation(CreateTodoMutation);
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        createTodo({
          text,
        });
        setText("");
      }}
      className={styles.addTodo}
    >
      <input
        className={styles.input}
        placeholder="Buy some milk"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className={styles.addButton}>Add</button>
    </form>
  );
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Railway NextJS Prisma</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Todos</h1>
        <h2 className={styles.desc}>
          NextJS app with a Pothos GraphQL API using prisma on{" "}
          <a href="https://railway.app">Railway</a>
        </h2>
      </header>

      <main className={styles.main}>
        <AddTodoInput />

        <TodoList />
      </main>
    </div>
  );
};

export default Home;

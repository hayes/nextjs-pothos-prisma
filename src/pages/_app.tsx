import '../styles/globals.css'
import React from 'react';
import { withUrqlClient } from 'next-urql';
import { NextComponentType} from 'next'
import { dedupExchange, fetchExchange, gql } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

function MyApp({ Component, pageProps }: {
  Component: NextComponentType,
  pageProps: {}
}) {
  return <Component {...pageProps} />
}

const TodoList = gql`
  query {
    todos {
      id
    }
  }
`;

export const cache = cacheExchange({
  updates: {
    Mutation: {
      createTodo(result, _args, cache, _info) {
        cache.updateQuery({ query: TodoList }, data => {
          data.todos.push(result.createTodo);
          return data;
        });
      },

      deleteTodo(_result, args, cache, _info) {
        cache.updateQuery({ query: TodoList }, data => {
          data.todos = data.todos.filter((todo: { id: string}) => todo.id !== args.id);

          return data
        });
      },
    },
  },
});

export default withUrqlClient((ssrExchange, ctx) => ({
  url: '/api/graphql',
  exchanges: [dedupExchange, cache, ssrExchange, fetchExchange],
}), {
  staleWhileRevalidate: true,
})(MyApp);


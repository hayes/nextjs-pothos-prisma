import { db } from "../../db";
import { builder } from "../builder";

builder.prismaObject('Todo', {
    fields: (t) => ({
        id: t.exposeID('id'),
        text: t.exposeString('text'),
        completed: t.exposeBoolean('completed'),
        created: t.expose('createdAt', { type: 'DateTime' }),
    }),
})

builder.queryFields((t) => ({
    todo: t.prismaField({
        type: 'Todo',
        nullable: true,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: (query, root, args, ctx) => {
            return db.todo.findUnique({
                ...query,
                where: {
                    id: args.id,
                },
            })
        },
    }),
    todos: t.prismaField({
        type: ['Todo'],
        resolve: (query, root, args, ctx) => {
            return db.todo.findMany({
                ...query,
            })
        },
    }),
}))

builder.mutationFields((t) => ({
    createTodo: t.prismaField({
        type: 'Todo',
        args: {
            text: t.arg.string({ required: true }),
            completed: t.arg.boolean({}),
        },
        resolve: (query, root, args, ctx) => {
            return db.todo.create({
                ...query,
                data: {
                    text: args.text,
                    completed: args.completed ?? false,
                },
            })
        },
    }),
    updateTodo: t.prismaField({
        type: 'Todo',
        args: {
            id: t.arg.id({ required: true }),
            text: t.arg.string({}),
            completed: t.arg.boolean({}),
        },
        resolve: (query, root, args, ctx) => {
            return db.todo.update({
                ...query,
                where: {
                    id: args.id,
                },
                data: {
                    text: args.text ?? undefined,
                    completed: args.completed ?? undefined,
                },
            })
        },
    }),
    deleteTodo: t.prismaField({
        type: 'Todo',
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: (query, root, args, ctx) => {
            return db.todo.delete({
                ...query,
                where: {
                    id: args.id,
                },
            })
        }
    }),
}))

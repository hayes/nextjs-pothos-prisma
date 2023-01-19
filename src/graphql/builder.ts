import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { DateTimeResolver } from "graphql-scalars";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../db";

interface Context {
    req: NextApiRequest
    res: NextApiResponse
}

export const builder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes
    Context: Context
    Scalars: {
        DateTime: {
            Input: Date
            Output: Date
        },
        ID: {
            Input: string
            Output: string | number
        }
    }
}>({
    plugins: [PrismaPlugin],
    prisma: {
        client: db
    }
});

builder.addScalarType('DateTime', DateTimeResolver, {})

builder.queryType({})
builder.mutationType({})

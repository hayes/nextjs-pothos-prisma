import { CodegenConfig } from '@graphql-codegen/cli'
import { printSchema } from 'graphql'
import { schema }  from './src/graphql/schema'

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/pages/**/*.tsx', 'src/components/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: []
    }
  }
}

export default config

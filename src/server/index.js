import { ApolloServer } from 'apollo-server'

import * as resolvers from './modules/resolvers'
import * as typeDefs from './modules/typeDefs'

const server = new ApolloServer({ typeDefs: Object.values(typeDefs), resolvers: Object.values(resolvers) })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { setContext } from "apollo-link-context"
import fetch from "isomorphic-unfetch"

import { Strings } from "consts/Strings"

const __DEV__ = process.env.NODE_ENV === "development"

// Instantiate required constructor fields
const cache = new InMemoryCache()
const authLink = setContext((_, { headers }) => {
  const token =
    typeof localStorage !== "undefined" && localStorage.getItem(Strings.token)
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...headers,
    },
  }
})

const isBrowser = typeof window !== "undefined"
const uri = __DEV__ ? "http://localhost:4044/" : process.env.GRAPHQL_URI
const httpLink = new HttpLink({
  uri,
  fetch: !isBrowser && fetch,
})

/**
 * export this 'extra client' to keep API routes functional
 */
export const client = new ApolloClient({
  connectToDevTools: isBrowser,
  ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
  // Provide required constructor fields
  cache: cache,
  link: authLink.concat(httpLink as any) as any,
  // Provide some optional constructor fields
  name: "you suck try harder",
  version: "0.0.0.alpha-1",
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
})

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: authLink.concat(httpLink as any) as any,
    cache: cache.restore(initialState),
  })
}

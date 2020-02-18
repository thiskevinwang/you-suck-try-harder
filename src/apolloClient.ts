import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { setContext } from "apollo-link-context"
import fetch from "isomorphic-unfetch"

const __DEV__ = process.env.NODE_ENV === "development"

// Instantiate required constructor fields
const cache = new InMemoryCache()
const authLink = setContext((_, { headers }) => {
  const token =
    typeof localStorage !== "undefined" && localStorage.getItem("token")
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

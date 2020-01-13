import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import fetch from "isomorphic-unfetch"

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
const httpLink = new HttpLink({
  uri: "http://localhost:4044/",
  fetch,
})

export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: authLink.concat(httpLink),

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

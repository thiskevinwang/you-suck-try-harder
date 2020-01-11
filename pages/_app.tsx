/**
 * This is where we will wrap the entire Next app in
 * a ApolloProvider, or Redx.
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp

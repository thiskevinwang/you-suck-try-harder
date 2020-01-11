/**
 * This is where we will wrap the entire Next app in
 * a ApolloProvider, or Redx.
 */
function MyApp({ Component, pageProps }) {
  console.log(pageProps)
  return <Component {...pageProps} />
}

export default MyApp

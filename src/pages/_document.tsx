import Document, { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheet, createGlobalStyle } from "styled-components"

/**
 * Docs on `public` vs `static` directory
 * @see https://nextjs.org/blog/next-9-1#public-directory-support
 */
const GlobalStyle = createGlobalStyle`
  body {
    font-family: Cereal, Arial, sans-serif;
    /* max-width: 800px; */
    /* padding-left: 1rem; */
    /* padding-right: 1rem; */
    /* margin-left: auto; */
    /* margin-right: auto; */
    margin: 0;
  }
`

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props =>
            sheet.collectStyles(
              <>
                <GlobalStyle />
                <App {...props} />
              </>
            ),
        })
      /**
       * getInitialProps has to be called AFTER sheet.collectStyles()
       */
      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } catch (error) {
      console.error(error)
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

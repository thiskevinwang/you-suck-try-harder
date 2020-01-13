import Document, { Html, Head, Main, NextScript } from "next/document"
import {
  ServerStyleSheet,
  StyleSheetManager,
  createGlobalStyle,
} from "styled-components"

/**
 * Docs on `public` vs `static` directory
 * @see https://nextjs.org/blog/next-9-1#public-directory-support
 */
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Cereal";
    src: url("/fonts/AirbnbCereal-Light.ttf");
    font-weight: 300;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/fonts/AirbnbCereal-Book.ttf");
    font-weight: 400;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/fonts/AirbnbCereal-Medium.ttf");
    font-weight: 500;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/fonts/AirbnbCereal-Bold.ttf");
    font-weight: 700;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/fonts/AirbnbCereal-ExtraBold.ttf");
    font-weight: 800;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/fonts/AirbnbCereal-Black.ttf");
    font-weight: 900;
  }

  body {
    font-family: Cereal, Arial, sans-serif;
  }
`

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    const initialProps = await Document.getInitialProps(ctx)
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => (
            <StyleSheetManager sheet={sheet.instance}>
              <App {...props} />
            </StyleSheetManager>
          ),
        })
      return {
        ...initialProps,
        styles: (
          <>
            <GlobalStyle />
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

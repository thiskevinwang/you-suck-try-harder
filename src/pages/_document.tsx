import Document, { Html, Head, Main, NextScript } from "next/document"
import {
  ServerStyleSheet,
  StyleSheetManager,
  createGlobalStyle,
} from "styled-components"

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Cereal";
    src: url("/public/fonts/AirbnbCereal-Light.ttf");
    font-weight: 300;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/public/fonts/AirbnbCereal-Book.ttf");
    font-weight: 400;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/public/fonts/AirbnbCereal-Medium.ttf");
    font-weight: 500;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/public/fonts/AirbnbCereal-Bold.ttf");
    font-weight: 700;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/public/fonts/AirbnbCereal-ExtraBold.ttf");
    font-weight: 800;
  }
  @font-face {
    font-family: "Cereal";
    src: url("/public/fonts/AirbnbCereal-Black.ttf");
    font-weight: 900;
  }

  body {
    font-family: Cereal, Arial, sans-serif;
  }
`

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    console.log("sheet", sheet.instance)
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

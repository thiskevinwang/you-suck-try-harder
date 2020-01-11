import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider } from "styled-components"

function getTheme(prefersDark: boolean) {
  return prefersDark ? { background: "black" } : { background: "white" }
}

function MyApp({ Component, pageProps }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  return (
    <ThemeProvider theme={getTheme(prefersDark)}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp

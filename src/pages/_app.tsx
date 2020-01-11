import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider } from "styled-components"
import { useSpring } from "react-spring"

function MyApp({ Component, pageProps }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const springProps = useSpring(
    prefersDark ? { background: "#f81ce5" } : { background: "#79ffe1" }
  )

  const theme = prefersDark
    ? { background: "#f81ce5" }
    : { background: "#79ffe1" }

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp

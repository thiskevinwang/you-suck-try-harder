import { useEffect } from "react"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider, createGlobalStyle } from "styled-components"
import { Provider, useDispatch, useSelector } from "react-redux"

import { Colors } from "../consts/Colors"
import { store, setIsDarkMode } from "../state"

const GlobalStyleLight = createGlobalStyle`
  body {
    background-color: ${Colors.silverLighter};
    transition: background-color 200ms ease-in-out;
    will-change: background-color;
  }
  h1, h2, h3, h4, h5, h6, span, div, p, b, i {
    color: ${Colors.black};
    transition: color 200ms ease-in-out;
    will-change: color;
  }
  a {
    text-decoration: none;
    color: ${Colors.black};
    box-shadow: ${Colors.geistCyan} 0px -5px 0px inset;
    transition: box-shadow 200ms ease-in-out;
    will-change: box-shadow;
  }
  a:hover {
    box-shadow: ${Colors.geistCyan} 0px -1.5rem 0px inset;
  }
`
const GlobalStyleDark = createGlobalStyle`
  body {
    background-color: ${Colors.blackDarker};
    transition: background-color 200ms ease-in-out;
    will-change: background-color;
  }
  h1, h2, h3, h4, h5, h6 {
    color: ${Colors.silver};
    transition: color 200ms ease-in-out;
    will-change: color;
  }
  a {
    text-decoration: none;
    color: ${Colors.silver};
    box-shadow: ${Colors.geistPurple} 0px -5px 0px inset;
    transition: box-shadow 200ms ease-in-out;
    will-change: box-shadow;
  }
  a:hover {
    box-shadow: ${Colors.geistPurple} 0px -1.5rem 0px inset;
  }
`

const ColorSchemeProvider = ({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const isDarkMode = useSelector(state => state.isDarkMode)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setIsDarkMode(prefersDark))
  }, [prefersDark, dispatch])

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.keyCode) {
          case 68 /** "d" */:
            return dispatch(setIsDarkMode(!isDarkMode))
          default:
            return
        }
      }
    }

    typeof window !== "undefined" &&
      window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [setIsDarkMode, dispatch, isDarkMode])

  const theme = isDarkMode
    ? { background: Colors.blackDarker }
    : { background: Colors.silverLighter }

  return (
    <ThemeProvider theme={theme}>
      {isDarkMode ? <GlobalStyleDark /> : <GlobalStyleLight />}
      {children}
    </ThemeProvider>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ColorSchemeProvider>
        <Component {...pageProps} />
      </ColorSchemeProvider>
    </Provider>
  )
}

export default MyApp

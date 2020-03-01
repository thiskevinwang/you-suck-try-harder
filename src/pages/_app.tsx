import { useEffect } from "react"
import App from "next/app"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider, createGlobalStyle, BaseProps } from "styled-components"
import { Provider, useDispatch, useSelector } from "react-redux"
import _ from "lodash"

import { Colors } from "consts/Colors"
import { store, setIsDarkMode, RootState, setIsNavOpen } from "state"
import { withApollo } from "lib/withApollo"

import DARK_THEME from "theme/dark"
import LIGHT_THEME from "theme/light"

/**
 * Optional
 * @see https://github.com/zeit/next.js/blob/canary/examples/with-loading/pages/_app.js
 */
// Router.events.on("routeChangeComplete", url => {
//   store.dispatch(setIsNavOpen(false))
// })

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
  input {
    font-size: 1rem;
  }
`

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
  rect {
    transition: fill 500ms ease, stroke 200ms ease, stroke-width 200ms ease;
  }
  rect:hover {
    stroke: ${Colors.greyDarker};
    stroke-width: 2;
    stroke-linejoin: round;
  }
`
const GlobalStyleDark = createGlobalStyle`
  body {
    background-color: ${Colors.blackDarker};
    transition: background-color 200ms ease-in-out;
    will-change: background-color;
  }
  h1, h2, h3, h4, h5, h6, span, div, p, b, i {
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
  rect {
    transition: fill 500ms ease, stroke 200ms ease, stroke-width 200ms ease;
  }
  rect:hover {
    stroke: ${Colors.greyLighter};
    stroke-width: 2;
    stroke-linejoin: round;
  }
`

const ColorSchemeProvider = ({ children }) => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)
  const isNavOpen = useSelector((state: RootState) => state.isNavOpen)
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
    ? {
        isNavOpen,
        isDarkMode,
        mode: "dark",
        ...DARK_THEME,
      }
    : {
        isNavOpen,
        isDarkMode,
        mode: "light",
        ...LIGHT_THEME,
      }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {isDarkMode ? <GlobalStyleDark /> : <GlobalStyleLight />}
      {children}
    </ThemeProvider>
  )
}

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Provider store={store}>
          <ColorSchemeProvider>
            <Component {...pageProps} />
          </ColorSchemeProvider>
        </Provider>
      </>
    )
  }
}

export default withApollo({ ssr: true })(MyApp)

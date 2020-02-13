import { useEffect } from "react"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider, createGlobalStyle } from "styled-components"
import { Provider, useDispatch, useSelector } from "react-redux"
import _ from "lodash"

import { Colors } from "consts/Colors"
import { store, setIsDarkMode, RootState } from "state"

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
    ? { background: Colors.blackDarker, isDarkMode: true }
    : { background: Colors.silverLighter, isDarkMode: false }

  _.assign(theme, {
    breakpoints: {
      lgDown: `(max-width: 1199.98px)`,
      mdDown: `(max-width: 991.98px)`,
      smDown: `(max-width: 767.98px)`,
      xsDown: `(max-width: 575.98px)`,
    },
  })

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

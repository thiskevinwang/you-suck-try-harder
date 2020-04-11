import { useEffect } from "react"
import { AppProps } from "next/app"
import Head from "next/head"
import Router from "next/router"
import { useLazyQuery, gql } from "@apollo/client"
import { useMediaQuery } from "@material-ui/core"
import { ThemeProvider, createGlobalStyle, BaseProps } from "styled-components"
import { Provider, useDispatch, useSelector } from "react-redux"
import _ from "lodash"
import "react-datepicker/dist/react-datepicker.css"

import NProgress from "nprogress"

import { ErrorBoundary } from "components/ErrorBoundary"
import { useAuthentication } from "hooks/useAuthentication"
import { Colors } from "consts/Colors"
import { store, setIsDarkMode, RootState, setMounted } from "state"
import { withApollo } from "lib/withApollo"

import DARK_THEME from "theme/dark"
import LIGHT_THEME from "theme/light"

import "../../_fonts.css"
import "../../_global.css"

/**
 * Optional
 * @see https://github.com/zeit/next.js/blob/canary/examples/with-loading/pages/_app.js
 */
Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

/**
 * Docs on `public` vs `static` directory
 * @see https://nextjs.org/blog/next-9-1#public-directory-support
 */
const GlobalStyle = createGlobalStyle`
  body {
    font-family: Cereal, Arial, sans-serif;
    margin: 0;
  }
  input {
    font-size: 1rem;
  }
`

const GlobalStyleLight = createGlobalStyle`
  text {
    fill: black;
  }
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
  text {
    fill: white;
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
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setMounted())
  }, [])
  const isMounted = useSelector((state: RootState) => state.isMounted)

  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  })
  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)
  const isNavOpen = useSelector((state: RootState) => state.isNavOpen)

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
      {isDarkMode ? (
        <style jsx>{`
          :root {
            --opposite: #79ffe1;
          }
        `}</style>
      ) : (
        <style jsx>{`
          :root {
            --opposite: #f81ce5;
          }
        `}</style>
      )}
      <GlobalStyle />
      {isDarkMode ? <GlobalStyleDark /> : <GlobalStyleLight />}
      {isMounted && children}
    </ThemeProvider>
  )
}

export const GET_USER_BY_ID = gql`
  fragment NameParts on User {
    first_name
    last_name
  }
  query GetUserById($id: ID!) {
    user: getUserById(id: $id) {
      id
      username
      ...NameParts
      avatar_url
    }
  }
`

const MyApp = ({ Component, pageProps, ...props }: AppProps) => {
  const { currentUserId } = useAuthentication()
  const [fetch] = useLazyQuery(GET_USER_BY_ID)
  useEffect(() => {
    currentUserId &&
      fetch({
        variables: { id: currentUserId },
      })
  }, [currentUserId])
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
        analytics.load("MQLGmY0cvPcOZsq1b97mxw1hZ3OMWGbg");
        analytics.page();
        }}();`,
          }}
        />
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <Provider store={store}>
        <ColorSchemeProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </ColorSchemeProvider>
      </Provider>
    </>
  )
}

export default withApollo({ ssr: true })(MyApp)

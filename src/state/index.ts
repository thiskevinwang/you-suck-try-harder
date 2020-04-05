import { createStore, compose, applyMiddleware } from "redux"

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

/**
 * action
 */
export const setMounted = () => {
  return { type: MOUNT }
}
export const setIsDarkMode = (isDarkMode: boolean) => {
  return {
    type: TOGGLE_DARKMODE,
    isDarkMode,
  }
}
export const setIsNavOpen = (isNavOpen: boolean) => {
  return {
    type: TOGGLE_NAV_OPEN,
    isNavOpen,
  }
}

/**
 * actionTypes
 */
const MOUNT = "MOUNT"
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"
const TOGGLE_NAV_OPEN = "TOGGLE_NAV_OPEN"

export interface RootState {
  isMounted: boolean
  isDarkMode: boolean
  isNavOpen: boolean
}
/**
 * initialState
 */
const initialState: RootState = {
  isMounted: false,
  isDarkMode: false,
  isNavOpen: false,
}

/**
 * reducer
 */
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case MOUNT:
      return { ...state, isMounted: true }
    case TOGGLE_DARKMODE:
      return { ...state, isDarkMode: action.isDarkMode }
    case TOGGLE_NAV_OPEN:
      return { ...state, isNavOpen: action.isNavOpen }
    default:
      return state
  }
}

// Enable Redux Dev Tools
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
        {} as typeof compose
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      )
    : compose

const enhancer = composeEnhancers(applyMiddleware())

/**
 * store
 * - reducer,
 * - preloadedState?
 * - enhancer?
 */
export const store = createStore(reducer, initialState, enhancer)

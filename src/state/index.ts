import { createStore, compose, applyMiddleware } from "redux"

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

/**
 * action
 */
export const setIsDarkMode = (isDarkMode: boolean) => {
  return {
    type: TOGGLE_DARKMODE,
    isDarkMode,
  }
}

/**
 * actionTypes
 */
const TOGGLE_DARKMODE = "TOGGLE_DARKMODE"

export interface RootState {
  isDarkMode: boolean
}
/**
 * initialState
 */
const initialState: RootState = {
  isDarkMode: false,
}

/**
 * reducer
 */
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_DARKMODE:
      return { ...state, isDarkMode: action.isDarkMode }
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

import * as React from "react"

interface State {
  hasError: boolean
  error: any
}
export class ErrorBoundary extends React.Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    ;(window as any).analytics.track("ERROR", error)
    ;(window as any).analytics?.track?.(errorInfo)
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Something went wrong.</h1>
          <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
        </>
      )
    }

    return this.props.children
  }
}

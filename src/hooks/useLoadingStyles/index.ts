import { useEffect, useState } from "react"
import { useSpring, config } from "react-spring"

import { Colors } from "consts/Colors"

const DELAY = 200

export const useLoadingStyles = () => {
  const [visibility, setVisibility] = useState<"hidden" | "visible">("hidden")
  useEffect(() => {
    const timer = setTimeout(() => setVisibility("visible"), DELAY)
    /**
     * Remember to clear timeouts!
     *
     * Warning: Can't perform a React state update on an unmounted component.
     * This is a no-op, but it indicates a memory leak in your application.
     * To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
     */
    return () => {
      clearTimeout(timer)
    }
  }, [])
  const props = useSpring({
    from: {
      opacity: 0.5,
      background: Colors.greyDarker,
    },
    to: async next => {
      while (1) {
        await next({ background: Colors.greyLighter, opacity: 1 })
        await next({ background: Colors.greyDarker, opacity: 0.5 })
      }
    },
    config: { ...config.molasses, duration: 1000 },
    delay: DELAY,
  })

  return {
    ...props,
    visibility,
  }
}

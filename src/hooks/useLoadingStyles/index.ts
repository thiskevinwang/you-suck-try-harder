import { useEffect, useState } from "react"
import { useSpring, config } from "react-spring"

import { Colors } from "consts/Colors"

const DELAY = 200

export const useLoadingStyles = () => {
  const [visibility, setVisibility] = useState<"hidden" | "visible">("hidden")
  useEffect(() => {
    setTimeout(() => setVisibility("visible"), DELAY)
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
    config: config.molasses,
    delay: DELAY,
  })

  return {
    ...props,
    visibility,
  }
}

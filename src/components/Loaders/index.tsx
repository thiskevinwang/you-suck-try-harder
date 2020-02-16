import React from "react"
import styled from "styled-components"
import { useSpring, animated, config } from "react-spring"

import { Colors } from "consts/Colors"

const StyledLoader = styled(animated.div)`
  height: 50px;
  max-width: 20rem;
  border-radius: 0.2rem;
  opacity: 0.5;
  margin: 1rem;
`

export const LoadingIndicator = () => {
  const props = useSpring({
    from: {
      background: Colors.greyDarker,
    },
    to: async next => {
      while (1) {
        await next({ background: Colors.greyLighter })
        await next({ background: Colors.greyDarker })
      }
    },
    config: config.molasses,
  })
  return <StyledLoader style={props} />
}

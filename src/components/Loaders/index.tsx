import React from "react"
import styled from "styled-components"
import { animated } from "react-spring"

import { useLoadingStyles } from "hooks/useLoadingStyles"

const StyledLoader = styled(animated.div)`
  height: 50px;
  max-width: 20rem;
  border-radius: 0.2rem;
  opacity: 0.5;
  margin: 1rem;
`

export const LoadingIndicator = () => {
  const props = useLoadingStyles()
  return <StyledLoader style={props} />
}

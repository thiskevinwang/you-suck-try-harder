import React from "react"
import styled from "styled-components"
import { animated } from "react-spring"

import { useLoadingStyles } from "hooks/useLoadingStyles"

const Loader = styled(animated.div)`
  display: flex;
  align-items: center;
  .img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  div > h3 {
    min-height: 1rem;
    width: 8rem;
    margin: 0px 0px 1pt;
  }
  div > p {
    min-height: 1rem;
    width: 5rem;
    margin: 0px;
  }
`

export const UserDetailsLoader = () => {
  const props = useLoadingStyles()
  return (
    <Loader>
      <div style={{ marginLeft: `1rem`, marginRight: `1rem` }}>
        <animated.div className="img" style={props} />
      </div>
      <div>
        <animated.h3 className="h3" style={props} />
        <animated.p className="p" style={props} />
      </div>
    </Loader>
  )
}

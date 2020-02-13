import * as React from "react"
import styled from "styled-components"
import { useSpring, animated, config } from "react-spring"

import { Colors } from "consts/Colors"

export const LineContainer = styled(animated.div)`
  width: 24px;
  height: 40px;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background: transparent;
`
const Inner = styled(animated.div)`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const Line = styled(animated.div)`
  height: 1px;
  width: 22px;
  background-color: ${props =>
    props.theme.isDarkMode ? Colors.silverDarker : Colors.blackLighter};
  transition: background-color 200ms ease-in-out;
`

interface HamburgerProps {
  isOpen: boolean
  clickHandler(): void
}
export const Hamburger: React.FC<HamburgerProps> = ({
  isOpen,
  clickHandler,
}) => {
  const { topTransform, bottomTransform } = useSpring({
    topTransform: !isOpen
      ? `translateY(-4px) rotate(0deg)`
      : `translateY(1px) rotate(45deg)`,
    bottomTransform: !isOpen
      ? `translateY(4px) rotate(0deg)`
      : `translateY(0px) rotate(-45deg)`,
    config: config.wobbly,
  })

  return (
    <LineContainer onClick={clickHandler}>
      <Inner>
        <Line style={{ transform: topTransform }}></Line>
        <Line style={{ transform: bottomTransform }}></Line>
      </Inner>
    </LineContainer>
  )
}

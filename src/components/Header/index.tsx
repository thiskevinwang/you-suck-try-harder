import { useRef } from "react"
import Link from "next/link"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { animated, useSpring, useChain } from "react-spring"
import { useMediaQuery } from "@material-ui/core"

import { Breakpoints } from "consts/Breakpoints"

import { ThemeSlider } from "../ThemeSlider"
import { Hamburger } from "../Hamburger"
import { RootState, setIsNavOpen } from "state"

export const Header = () => {
  const isNavOpen = useSelector((s: RootState) => s.isNavOpen)
  const dispatch = useDispatch()
  const toggleIsNavOpen = () => dispatch(setIsNavOpen(!isNavOpen))

  const lgUp = useMediaQuery(Breakpoints.lgUp, { noSsr: true })

  const props = useSpring({})

  const hwRef = useRef()
  const hamburgerWidth = useSpring({
    width: lgUp ? 0 : 40,
    ref: hwRef,
  })

  const hoRef = useRef()
  const hamburgerOpacity = useSpring({
    opacity: lgUp ? 0 : 1,
    ref: hoRef,
  })
  // lgUp
  // ? hide then shift
  // : shift then hide
  useChain(
    lgUp ? [hoRef, hwRef] : [hwRef, hoRef],
    lgUp ? [0, 0.5] : [0.5, 0.75]
  )

  return (
    <StyledHeader style={props}>
      <HeaderSection>
        <animated.div
          style={{ overflow: "hidden", ...hamburgerWidth, ...hamburgerOpacity }}
        >
          <Hamburger isOpen={isNavOpen} clickHandler={toggleIsNavOpen} />
        </animated.div>
        <NavLinks>
          <Link href="/about">
            <A>About</A>
          </Link>
          <Link href="/settings">
            <A>Settings</A>
          </Link>
        </NavLinks>
      </HeaderSection>
      <HeaderSection>
        <NavHeader>
          <ThemeSlider />
        </NavHeader>
      </HeaderSection>
    </StyledHeader>
  )
}

const A = styled.a`
  margin-right: 0.5rem;
`
const StyledHeader = styled(animated.header)`
  position: absolute;
  top: ${(p) => p.theme.topAsideHeight};
  left: 0rem;
  right: 0rem;

  height: ${(p) => p.theme.headerHeight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  z-index: 5;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderColor};

  background-color: ${(props) => props.theme.colors.header};
  transition: background-color 200ms ease-in-out;

  @media ${Breakpoints.lgUp} {
    position: fixed;
    top: ${(p) => p.theme.topAsideHeight};
    left: 0;
    right: 0;
  }
`

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
`

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const NavLinks = styled.div`
  display: flex;
  align-items: center;
`

// Gatsby
// const Header = styled.header`
//   position: absolute;
//   top: 2.5rem;
//   left: 0rem;
//   right: 0rem;
//   height: 4rem;
//   width: 100%;
// `
// const HeaderInner = styled.div`
//   padding-left: 1.5rem;
//   padding-right: 1.5rem;
//   display: flex;
//   align-items: center;
//   height: 100%;
//   margin: 0 auto;
// `

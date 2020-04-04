import { useEffect } from "react"
import Link from "next/link"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { animated, useSpring } from "react-spring"
import { useMediaQuery } from "@material-ui/core"

import { Breakpoints } from "consts/Breakpoints"

import { LineContainer } from "../Hamburger"
import { ThemeSlider } from "../ThemeSlider"
import { Hamburger } from "../Hamburger"
import { RootState, setIsNavOpen } from "state"

export const Header = () => {
  const isNavOpen = useSelector((s: RootState) => s.isNavOpen)
  const dispatch = useDispatch()
  const toggleIsNavOpen = () => dispatch(setIsNavOpen(!isNavOpen))

  const lgUp = useMediaQuery(Breakpoints.lgUp, { noSsr: true })

  // reset navbar state when expanding the browser
  useEffect(() => {
    if (lgUp) dispatch(setIsNavOpen(false))
  }, [lgUp])

  const props = useSpring({})
  return (
    <StyledHeader style={props}>
      <HeaderSection>
        <Hamburger isOpen={isNavOpen} clickHandler={toggleIsNavOpen} />
        <NavLinks>
          <Link href="/">
            <A>Overview</A>
          </Link>
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
  height: ${(p) => p.theme.headerHeight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  z-index: 5;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderColor};

  background-color: ${(props) => props.theme.background};
  transition: background-color 200ms ease-in-out;

  @media ${Breakpoints.lgUp} {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem 1.2rem;
    /* transform: translateX(0); */

    ${LineContainer} {
      display: none;
    }
  }
`
// transform: ${p => (p.theme.isNavOpen ? `translateX(16rem)` : null)};

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

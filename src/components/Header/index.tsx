import { useReducer } from "react"
import Link from "next/link"
import styled, { css } from "styled-components"

import { Colors } from "consts/Colors"
import { Breakpoints } from "consts/Breakpoints"

import { ThemeSlider } from "../ThemeSlider"
import { Hamburger, LineContainer } from "../Hamburger"

const A = styled.a`
  margin-right: 0.5rem;
`
const HeaderItems = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.background};
  transition: background-color 200ms ease-in-out;

  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  ${LineContainer} {
    @media ${Breakpoints.smDown} {
      justify-self: flex-end;
    }
    @media ${Breakpoints.mdUp} {
      display: none;
    }
  }
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

export const Header = () => {
  const [hamburgerIsOpen, toggleHamburgerIsOpen] = useReducer(s => !s, false)
  return (
    <HeaderItems>
      <NavHeader>
        <ThemeSlider />
        <Hamburger
          isOpen={hamburgerIsOpen}
          clickHandler={toggleHamburgerIsOpen}
        />
      </NavHeader>
      <NavLinks>
        <Link href="/">
          <A>Overview</A>
        </Link>
        <Link href="/about">
          <A>About</A>
        </Link>
        <Link href="">
          <A>Settings</A>
        </Link>
      </NavLinks>
    </HeaderItems>
  )
}

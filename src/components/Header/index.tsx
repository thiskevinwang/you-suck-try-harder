import { useReducer } from "react"
import Link from "next/link"
import styled from "styled-components"

import { ThemeSlider } from "../ThemeSlider"
import { Hamburger } from "../Hamburger"

const A = styled.a`
  margin-right: 0.5rem;
`

const HeaderItems = styled.div`
  display: flex;
`

const Links = styled.div`
  display: flex;
  align-items: center;
`

export const Header = () => {
  const [hamburgerIsOpen, toggleHamburgerIsOpen] = useReducer(s => !s, false)
  return (
    <HeaderItems>
      <ThemeSlider />
      <Links>
        <Link href="/">
          <A>Home</A>
        </Link>
        <Link href="/about">
          <A>About</A>
        </Link>
      </Links>
      <Hamburger
        isOpen={hamburgerIsOpen}
        clickHandler={toggleHamburgerIsOpen}
      />
    </HeaderItems>
  )
}

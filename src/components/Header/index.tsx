import Link from "next/link"
import styled from "styled-components"

import { ThemeSlider } from "../ThemeSlider"

const A = styled.a`
  margin-right: 0.5rem;
`

export const Header = () => {
  return (
    <div>
      <ThemeSlider />
      <div>
        <Link href="/">
          <A>Home</A>
        </Link>
        <Link href="/about">
          <A>About</A>
        </Link>
      </div>
    </div>
  )
}

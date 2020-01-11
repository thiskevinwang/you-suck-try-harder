import { useContext } from "react"
import styled, { ThemeContext } from "styled-components"
import { animated } from "react-spring"

import { Header } from "../Header"

const Div = styled(animated.div)`
  background: ${({ theme }) => theme.background};
`

export const Layout: React.FC = ({ children }) => {
  const themeContext = useContext(ThemeContext)
  console.log(themeContext)
  return (
    <Div>
      <Header />
      {children}
    </Div>
  )
}

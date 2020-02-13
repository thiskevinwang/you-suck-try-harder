import { Header } from "../Header"
import { StyledBody } from "../Body"

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <StyledBody>{children}</StyledBody>
    </>
  )
}

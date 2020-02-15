import styled from "styled-components"
import { useSelector } from "react-redux"
import { animated, useSpring } from "react-spring"
import { useMediaQuery } from "@material-ui/core"

import { Header } from "components/Header"
import LeftSidebar from "components/LeftSidebar"
import { RootState } from "state"

import { Breakpoints } from "consts/Breakpoints"

export const Layout: React.FC = ({ children }) => {
  const isNavOpen = useSelector((s: RootState) => s.isNavOpen)
  const lgUp = useMediaQuery(Breakpoints.lgUp)
  const props = useSpring({
    opacity: lgUp ? 1 : isNavOpen ? 0.3 : 1,
    transform: lgUp
      ? `translateX(0rem)`
      : isNavOpen
      ? `translateX(16rem)`
      : `translateX(0rem)`,
  })
  return (
    <>
      <Header />
      <SiteWrapper>
        <LeftSidebar />
        <SiteContentWrapper>
          <SiteContent style={props}>{children}</SiteContent>
        </SiteContentWrapper>
        <aside>Right side bar</aside>
      </SiteWrapper>
    </>
  )
}

const SiteWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
`

const SiteContentWrapper = styled.div`
  flex-grow: 1;
  min-width: 20rem;
`

const SiteContent = styled(animated.main)`
  padding: 2rem 1rem 2rem;

  @media ${Breakpoints.lgUp} {
    opacity: 1;
    padding: 7rem 3rem 3rem;
    max-width: 50rem;
  }
`

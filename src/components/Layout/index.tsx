import styled, { BaseProps } from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { animated, useSpring } from "react-spring"
import { useMediaQuery } from "@material-ui/core"

import { Header } from "components/Header"
import LeftSidebar from "components/LeftSidebar"
import TopAside from "components/TopAside"
import { RootState, setIsNavOpen } from "state"

import { Breakpoints } from "consts/Breakpoints"

export const Layout: React.FC = ({ children }) => {
  const isNavOpen = useSelector((s: RootState) => s.isNavOpen)
  const dispatch = useDispatch()
  const handleCloseModal = () => dispatch(setIsNavOpen(false))
  const lgUp = useMediaQuery(Breakpoints.lgUp, { noSsr: true })
  const props = useSpring({
    opacity: lgUp ? 1 : isNavOpen ? 0.3 : 1,
  })
  return (
    <>
      <TopAside />
      <Header />
      <SiteWrapper>
        {!lgUp && isNavOpen && (
          <OutsideClickHelper onClick={handleCloseModal} />
        )}
        <LeftSidebar />
        <SiteContentWrapper>
          <SiteContent style={props}>
            <Margin>{children}</Margin>
          </SiteContent>
        </SiteContentWrapper>
      </SiteWrapper>
    </>
  )
}
const OutsideClickHelper = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1;
`

const SiteWrapper = styled(animated.div)`
  display: flex;
  min-height: 100vh;

  /* NOTE TO SELF, this conflicts with STICKY because CSS IS A BITCH */
  /* overflow-x: hidden; */
`

const SiteContentWrapper = styled.div`
  flex-grow: 1;
  min-width: 20rem;
`

const SiteContent = styled(animated.main)`
  padding-top: calc(
    ${(p: BaseProps) => p.theme.headerHeight} +
      ${(p: BaseProps) => p.theme.topAsideHeight}
  );
`

/**
 * Margin helper, for now...
 */
const Margin = styled.div`
  margin-left: 2rem;
  margin-right: 2rem;
`

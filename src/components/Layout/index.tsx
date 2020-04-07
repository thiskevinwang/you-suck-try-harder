import styled, { BaseProps } from "styled-components"
import { useSelector, useDispatch } from "react-redux"
import { animated, useSpring } from "react-spring"
import { useMediaQuery } from "@material-ui/core"

import { Header } from "components/Header"
import LeftSidebar from "components/LeftSidebar"
import TopAside from "components/TopAside"
import { RootState, setIsNavOpen } from "state"
import { Colors } from "consts/Colors"

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
      <Footer></Footer>
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
  position: relative;
`

const SiteContentWrapper = styled.div`
  flex-grow: 1;
  min-width: 20rem;

  background-color: ${(p: BaseProps) => p.theme.colors.body};
  transition: background-color 200ms ease-in-out;
  will-change: background-color;
`

const SiteContent = styled(animated.main)`
  min-height: calc(
    100vh - 120px - ${(p: BaseProps) => p.theme.headerHeight} -
      ${(p: BaseProps) => p.theme.topAsideHeight}
  );

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

const Footer = styled.footer`
  background: ${(p: BaseProps) =>
    p.theme.isDarkMode ? Colors.blackDarker : Colors.silverDark};
  height: 120px;
  z-index: -1000;
`

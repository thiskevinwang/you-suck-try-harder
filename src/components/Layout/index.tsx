import styled, { BaseProps } from "styled-components"
import { useSelector } from "react-redux"
import { animated, useSpring } from "react-spring"
import { useMediaQuery } from "@material-ui/core"

import { Header } from "components/Header"
import LeftSidebar from "components/LeftSidebar"
import { RootState } from "state"
import { getContrast } from "utils"
import { Colors } from "consts/Colors"

import { Breakpoints } from "consts/Breakpoints"

const Aside = styled.aside`
  background-color: ${(p: BaseProps) =>
    p.theme.isDarkMode ? Colors.geistPurple : Colors.geistCyan};
  filter: saturate(50%);
  :hover {
    filter: saturate(100%);
  }
  transition: background-color 200ms ease-in-out, filter 200ms ease-in-out;
  height: 2.5rem;
  position: fixed;
  width: 100%;
  z-index: 10;
  span {
    color: ${(p) =>
      p.theme.isDarkMode
        ? getContrast(Colors.geistPurple)
        : getContrast(Colors.geistCyan)};
  }
`
const AsideInner = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  font-weight: 100;
  @media (max-width: 575.98px) {
    /* display: none; */
  }
`

export const Layout: React.FC = ({ children }) => {
  const isNavOpen = useSelector((s: RootState) => s.isNavOpen)
  const lgUp = useMediaQuery(Breakpoints.lgUp, { noSsr: true })
  const props = useSpring({
    opacity: lgUp ? 1 : isNavOpen ? 0.3 : 1,
  })
  return (
    <>
      <Aside>
        <AsideInner></AsideInner>
      </Aside>
      <Header />
      <SiteWrapper>
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

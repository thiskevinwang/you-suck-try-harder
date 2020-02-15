import styled from "styled-components"

import { Header } from "components/Header"
import LeftSidebar from "components/LeftSidebar"

import { Breakpoints } from "consts/Breakpoints"

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <SiteWrapper>
        <LeftSidebar />
        <SiteContentWrapper>
          <SiteContent>{children}</SiteContent>
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
  /* background: ${p => p.theme.colors.background}; */
  /* transition: background 0.25s var(--ease-in-out-quad); */
`

const SiteContentWrapper = styled.div`
  flex-grow: 1;
  min-width: 20rem;
`

const SiteContent = styled.main`
  padding: 2rem 1rem 2rem;
  opacity: ${p => (p.theme.isNavOpen ? 0.3 : 1)};
  transform: ${p => (p.theme.isNavOpen ? `translateX(16rem)` : null)};
  transition-property: opacity, transform;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;

  @media ${Breakpoints.lgUp} {
    transform: translateX(0);
    opacity: 1;
    padding: 7rem 3rem 3rem;
    max-width: 50rem;
  }
`
/* transition: 0.25s ease-in-out; */
/* opacity: ${p => (p.navOpen ? 0.3 : 1)}; */
/* transform: ${p => (p.navOpen ? `translateX(16rem)` : null)}; */

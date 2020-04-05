import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import styled, { BaseProps } from "styled-components"
import { animated, useSpring } from "react-spring"

import { RootState } from "state"
import { useAuthentication } from "hooks/useAuthentication"
import { Breakpoints } from "consts/Breakpoints"
import { Strings } from "consts/Strings"

import { LogOut, LogIn, Home, UserPlus } from "icons"

const LeftSidebar = () => {
  const { currentUserId } = useAuthentication()
  const router = useRouter()
  const handleLogout = () => {
    typeof window !== "undefined" && localStorage.removeItem(Strings.token)
    router.reload()
  }

  const isNavOpen = useSelector((s: RootState) => s.isNavOpen)
  const lgUp = useMediaQuery(Breakpoints.lgUp, { noSsr: true })
  const props = useSpring({
    transform: lgUp
      ? `translateX(0rem)`
      : isNavOpen
      ? `translateX(16rem)`
      : `translateX(0rem)`,
  })
  const leftSidebarWrapperProps = useSpring({
    marginLeft: lgUp ? `0rem` : `-16rem`,
  })
  return (
    <LeftSidebarWrapper style={leftSidebarWrapperProps}>
      <MockHeaderHeight />
      <LeftSidebarNav style={props}>
        <StyledNavItem>
          <Link href="/">
            <a>
              <StyledNavItemInner>
                <Home /> Home
              </StyledNavItemInner>
            </a>
          </Link>
        </StyledNavItem>
        {currentUserId ? (
          <>
            <StyledNavItem>
              <Link href={""}>
                <a onClick={handleLogout}>
                  <StyledNavItemInner>
                    <LogOut /> Logout
                  </StyledNavItemInner>
                </a>
              </Link>
            </StyledNavItem>
          </>
        ) : (
          <>
            <StyledNavItem>
              <Link href="/auth/login">
                <a>
                  <StyledNavItemInner>
                    <LogIn /> Login
                  </StyledNavItemInner>
                </a>
              </Link>
            </StyledNavItem>
            <StyledNavItem>
              <Link href="/auth/signup">
                <a>
                  <StyledNavItemInner>
                    <UserPlus />
                    Sign up
                  </StyledNavItemInner>
                </a>
              </Link>
            </StyledNavItem>
          </>
        )}
      </LeftSidebarNav>
    </LeftSidebarWrapper>
  )
}

const StyledNavItemInner = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`

const StyledNavItem = styled.li`
  position: relative;
  display: block;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  list-style: none;

  transition: background-color 200ms ease-in-out;
  :hover,
  :focus {
    background-color: ${(p: BaseProps) => p.theme.colors.borderColor};
  }
`

const LeftSidebarWrapper = styled(animated.aside)`
  z-index: 1;
  flex: 0 0 16rem;
  position: sticky;
  top: 200px;
  background: grey;
  @media ${Breakpoints.lgUp} {
  }
`

interface LeftSidebarNavProps {
  navOpen?: boolean
}
const MockHeaderHeight = styled.div`
  height: calc(
    ${(p: BaseProps) => p.theme.headerHeight} +
      ${(p: BaseProps) => p.theme.topAsideHeight}
  );
`
const LeftSidebarNav = styled(animated.nav)<LeftSidebarNavProps>`
  background: ${(p: BaseProps) => p.theme.colors.leftSidebarNavBackground};
  border-top: 1px solid ${(p: BaseProps) => p.theme.colors.borderColor};
  border-right: 1px solid ${(p: BaseProps) => p.theme.colors.borderColor};
  position: fixed;
  top: calc(
    ${(p: BaseProps) => p.theme.headerHeight} +
      ${(p: BaseProps) => p.theme.topAsideHeight}
  );
  width: 16rem;
  height: 100%;
  @media ${Breakpoints.mdDown} {
    position: sticky;
    top: calc(
    /* ${(p: BaseProps) => p.theme.headerHeight} + */
      ${(p: BaseProps) => p.theme.topAsideHeight}
  );
    height: calc(100vh - ${(p: BaseProps) => p.theme.topAsideHeight});
  }
`

export default React.memo(LeftSidebar)

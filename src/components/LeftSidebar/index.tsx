import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import { useSelector, useDispatch } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import styled, { BaseProps } from "styled-components"
import { animated, useSpring } from "react-spring"

import { RootState, setIsNavOpen } from "state"
import { useAuthentication } from "hooks/useAuthentication"
import { Breakpoints } from "consts/Breakpoints"
import { Strings } from "consts/Strings"
import { Hamburger } from "components/Hamburger"

import { LogOut, LogIn, Home, UserPlus } from "icons"

const LeftSidebar = () => {
  const dispatch = useDispatch()
  const toggleIsNavOpen = () => dispatch(setIsNavOpen(!isNavOpen))

  const { currentUserId } = useAuthentication()
  const router = useRouter()
  const handleLogout = () => {
    typeof window !== "undefined" && localStorage.removeItem(Strings.token)
    router.reload()
  }

  const isNavOpen = useSelector((s: RootState) => s.isNavOpen)
  const lgUp = useMediaQuery(Breakpoints.lgUp)
  const props = useSpring({
    transform: lgUp
      ? `translateX(0rem)`
      : isNavOpen
      ? `translateX(16rem)`
      : `translateX(0rem)`,
  })
  return (
    <LeftSidebarWrapper>
      <LeftSidebarNav style={props}>
        <LeftSidebarHeader>
          <Hamburger isOpen={isNavOpen} clickHandler={toggleIsNavOpen} />
        </LeftSidebarHeader>
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

  /* color: ${(p: BaseProps) => p.theme.colors.borderColor}; */
  svg:not(.filled) {
    /* stroke: ${(p: BaseProps) => p.theme.colors.borderColor}; */
  }
  :hover,
  :focus {
    /* color: ${(p: BaseProps) => p.theme.colors.main}; */
    svg:not(.filled) {
      /* stroke: ${(p: BaseProps) => p.theme.colors.main}; */
    }
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

const LeftSidebarHeader = styled.header`
  height: ${(p: BaseProps) => p.theme.headerHeight};
  padding: 1rem 1rem;
  border-bottom: 1px solid ${(p: BaseProps) => p.theme.colors.borderColor};
  /* hide the sidebar header on lgUp */
  @media ${Breakpoints.lgUp} {
    display: none;
  }
`

const LeftSidebarWrapper = styled.aside`
  z-index: 1;
  margin-left: -16rem;
  flex: 0 0 16rem;
  /* font-size: 0.875rem; */
  @media ${Breakpoints.lgUp} {
    margin-left: 0;
  }
`

const LeftSidebarNav = styled(animated.nav)`
  background: ${(p: BaseProps) => p.theme.colors.leftSidebarNavBackground};
  border-right: 1px solid ${(p: BaseProps) => p.theme.colors.borderColor};
  position: fixed;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  width: 16rem;
  height: 100%;
  /* padding: 1rem 0; */
  @media ${Breakpoints.lgUp} {
    padding: 6.6rem 0 1rem;
  }
`
LeftSidebar.propTypes = {
  navOpen: PropTypes.bool,
}

export default React.memo(LeftSidebar)

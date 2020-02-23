import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import styled from "styled-components"
import { animated, useSpring } from "react-spring"

import { RootState } from "state"
import { useAuthentication } from "hooks/useAuthentication"
import { Breakpoints } from "consts/Breakpoints"
import { Strings } from "consts/Strings"

const StyledNavItem = styled.li`
  position: relative;
  display: block;
  padding: 0;
  margin: 0.2rem 0 0 1rem;
  list-style: none;
`

const LeftSidebar = () => {
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
        <StyledNavItem>
          <Link href="/">
            <a>Home</a>
          </Link>
        </StyledNavItem>
        {currentUserId ? (
          <>
            <StyledNavItem>
              <Link href={""}>
                <a onClick={handleLogout}>Logout</a>
              </Link>
            </StyledNavItem>
          </>
        ) : (
          <>
            <StyledNavItem>
              <Link href="/auth/login">
                <a>Login</a>
              </Link>
            </StyledNavItem>
            <StyledNavItem>
              <Link href="/auth/signup">
                <a>Sign up</a>
              </Link>
            </StyledNavItem>
            <StyledNavItem>
              <Link href="/auth/forgot">
                <a>Forgot</a>
              </Link>
            </StyledNavItem>
          </>
        )}
      </LeftSidebarNav>
    </LeftSidebarWrapper>
  )
}

const LeftSidebarWrapper = styled.aside`
  margin-left: -16rem;
  flex: 0 0 16rem;
  font-size: 0.875rem;
  @media ${Breakpoints.lgUp} {
    margin-left: 0;
  }
`

const LeftSidebarNav = styled(animated.nav)`
  background: ${p => p.theme.colors.leftSidebarNavBackground};
  position: fixed;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  width: 16rem;
  height: 100%;
  padding: 1rem 0;
  @media ${Breakpoints.lgUp} {
    padding: 6.6rem 0 1rem;
  }
`
LeftSidebar.propTypes = {
  navOpen: PropTypes.bool,
}

export default React.memo(LeftSidebar)

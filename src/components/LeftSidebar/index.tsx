import * as React from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { useMediaQuery } from "@material-ui/core"
import styled from "styled-components"
import { animated, useSpring } from "react-spring"

import { RootState } from "state"

import { Breakpoints } from "consts/Breakpoints"

const LeftSidebar = () => {
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
        <div>this is a test</div>
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

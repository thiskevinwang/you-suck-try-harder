import * as React from "react"
import PropTypes from "prop-types"
import { withRouter } from "next/router"
import Link from "next/link"
import { compose } from "redux"
import styled from "styled-components"

import { Breakpoints } from "consts/Breakpoints"

const LeftSidebar = () => {
  return (
    <LeftSidebarWrapper>
      <LeftSidebarNav>
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

const LeftSidebarNav = styled.nav`
  background: ${p => p.theme.colors.leftSidebarNavBackground};
  position: fixed;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  width: 16rem;
  height: 100%;
  padding: 1rem 0;
  transform: ${p => (p.theme.isNavOpen ? `translateX(16rem)` : null)};
  transition: transform 200ms ease-in-out;
  @media ${Breakpoints.lgUp} {
    transform: translateX(0);
    padding: 6.6rem 0 1rem;
  }
`
LeftSidebar.propTypes = {
  navOpen: PropTypes.bool,
}

export default React.memo(LeftSidebar)

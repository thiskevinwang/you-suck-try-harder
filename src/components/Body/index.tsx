import styled from "styled-components"

import { Breakpoints } from "consts/Breakpoints"

export const StyledBody = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  @media ${Breakpoints.mdUp} {
    padding-left: 50px;
    padding-right: 50px;
  }
`

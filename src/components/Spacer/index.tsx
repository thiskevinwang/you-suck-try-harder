import styled from "styled-components"

interface SpacerProps {
  x?: number
  y?: number
}
export const Spacer = styled.div<SpacerProps>`
  padding-left: ${props => (props.x ?? 0) / 2}px;
  padding-right: ${props => (props.x ?? 0) / 2}px;
  padding-top: ${props => (props.y ?? 0) / 2}px;
  padding-bottom: ${props => (props.y ?? 0) / 2}px;
`

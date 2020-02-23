import { CircularProgress, CircularProgressProps } from "@material-ui/core"
import styled from "styled-components"
import theme from "styled-theming"

import { Colors } from "consts/Colors"

const color = theme("mode", {
  light: Colors.geistCyan,
  dark: Colors.geistPurple,
})

const StyledWrapper = styled(CircularProgress)`
  color: ${color};

  svg {
  }
`

export const StyledCircularProgress = ({
  size,
  ...props
}: CircularProgressProps) => {
  return <StyledWrapper color="inherit" size={size} {...props} />
}

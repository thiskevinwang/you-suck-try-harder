import styled, { BaseProps } from "styled-components"

const Svg = styled.svg`
  stroke: ${(p: BaseProps) => p.theme.colors.main};
  transition: stroke 200ms ease-in-out;
`

export const CheckInCircle = () => (
  <Svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    shapeRendering="geometricPrecision"
    // style="color:var(--geist-foreground)"
  >
    <path d="M8 11.857l2.5 2.5L15.857 9M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
  </Svg>
)

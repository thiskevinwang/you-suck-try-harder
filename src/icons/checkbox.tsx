import styled, { BaseProps } from "styled-components"

const Svg = styled.svg`
  stroke: ${(p: BaseProps) => p.theme.colors.main};
  transition: stroke 200ms ease-in-out;
`

export const Checkbox = () => (
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
    <path d="M16.09 3H7.91A4.91 4.91 0 003 7.91v8.18A4.909 4.909 0 007.91 21h8.18A4.909 4.909 0 0021 16.09V7.91A4.909 4.909 0 0016.09 3z" />
  </Svg>
)

import styled, { BaseProps } from "styled-components"

const Svg = styled.svg`
  stroke: ${(p: BaseProps) => p.theme.colors.main};
  transition: stroke 200ms ease-in-out;
`

export const ZapOff = () => (
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
    <path d="M12.41 6.75L13 2l-2.43 2.92" />
    <path d="M18.57 12.91L21 10h-5.34" />
    <path d="M8 8l-5 6h9l-1 8 5-6" />
    <path d="M1 1l22 22" />
  </Svg>
)

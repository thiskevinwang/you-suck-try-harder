import styled, { BaseProps } from "styled-components"

const Svg = styled.svg`
  stroke: ${(p: BaseProps) => p.theme.colors.contrast};
  fill: ${(p: BaseProps) => p.theme.colors.main};
`

export const XCircleFill = () => (
  <Svg
    className="filled"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    shapeRendering="geometricPrecision"
    // style="color:var(--geist-foreground);--geist-fill:currentColor;--geist-stroke:var(--geist-background)"
  >
    <circle cx="12" cy="12" r="10" fill="var(--geist-fill)" />
    <path d="M15 9l-6 6" stroke="var(--geist-stroke)" />
    <path d="M9 9l6 6" stroke="var(--geist-stroke)" />
  </Svg>
)

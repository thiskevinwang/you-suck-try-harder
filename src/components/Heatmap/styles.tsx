import styled, { BaseProps } from "styled-components"
import { animated } from "react-spring"

import { Colors } from "consts/Colors"

export const HEIGHT = 10
export const MARGIN = 3
export const STROKE_MARGIN = 1
export const ROWS = 8
export const OFFSET_LEFT = 2

export const Total = styled(animated.div)`
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  /* justify-content: center; */
  background-color: ${(p) =>
    p.theme.isDarkMode ? Colors.blackLighter : Colors.silverDarker};
`
export const Sends = styled(animated.div)`
  display: flex;
  /* justify-content: center; */
`
export const Tooltip = styled(animated.code)`
  display: inline-block;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${(p: BaseProps) => p.theme.formInput.borderColorBase};
`
export const HeatmapContainer = styled(animated.div)`
  padding-top: 4px;
  margin-right: 16px;
  margin-left: 16px;
  display: flex;
  flex-direction: row-reverse;
  overflow-x: hidden;
  /* overflow-y: hidden; */
  /* height: ${(HEIGHT + STROKE_MARGIN) * 2 + ROWS * 13}px; */

  @media (min-width: 768px) {
  }
  /* Large devices (desktops, less than 1200px) */
  @media (max-width: 1199.98px) {
    /* align-items: flex-end; */
  }
  /* Medium devices (tablets, less than 992px) */
  @media (max-width: 991.98px) {
  }
  /* Small devices (landscape phones, less than 768px) */
  @media (max-width: 767.98px) {
    /* flex-direction: column; */
    /* align-items: flex-end; */
    /* justify-content: flex-end; */
  }
  /* Extra small devices (portrait phones, less than 576px) */
  @media (max-width: 575.98px) {
  }
`
export const HeatmapInner = styled.div`
  flex: 1;
`
export const Svg = styled(animated.svg)`
  width: 722px;
  /* height: 112px; */
`

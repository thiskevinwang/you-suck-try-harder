import { useRef, useEffect } from "react"
import * as d3 from "d3"
import _ from "lodash"
import styled from "styled-components"
import { animated } from "react-spring"
import { useSelector } from "react-redux"

import { RootState } from "../../state"
import { Colors } from "../../consts/Colors"

export interface Bin {
  value: number
  date: string
}
export type Week = [Bin, Bin, Bin, Bin, Bin, Bin, Bin]
export interface Props {
  data?: Week[]
}

const HEIGHT = 10
const MARGIN = 3
const STROKE_MARGIN = 1

const Tooltip = styled(animated.div)`
  border: solid;
  border-color: lightgrey;
  border-width: 1px;
  border-radius: 0.2rem;
  padding: 5px;

  display: flex;
  width: 400px;

  margin-right: auto;
  .tooltip {
    transition: opacity 100ms;
    will-change: opacity;
  }
`
const HeatmapContainer = styled(animated.div)`
  display: flex;
  width: 100%;
  height: ${(HEIGHT + STROKE_MARGIN) * 2 + 7 * 13}px;
  margin-bottom: 1rem;
`
const Svg = styled(animated.svg)`
  padding: 10px;
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  /* margin-left: auto; */
  /* margin-right: auto; */
  display: flex;
  width: 100%;
`
const BASE_LIGHT = Colors.silverLighter
const BASE_DARK = Colors.blackDarker
const LIGHT = Colors.geistCyan
const DARK = Colors.geistPurple

/**
 * @usage
 * ```ts
 * .attr("fill", d => myColor(d.value))
 */
const myColor = d3
  .scaleLinear<string, string>()
  .domain([0, 100])
  .range([BASE_LIGHT, LIGHT])
const myDarkColor = d3
  .scaleLinear<string, string>()
  .domain([0, 100])
  .range([BASE_DARK, DARK])

export default function Heatmap({ data }: Props) {
  const d3Container = useRef(null)
  const tooltipRef = useRef(null)
  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)

  useEffect(() => {
    if (data && d3Container.current) {
      const tooltip = d3
        .select(tooltipRef.current)
        .style("opacity", 0)
        .attr("class", "tooltip")

      const mouseover = function(d: Bin) {
        tooltip.style("opacity", 1)
      }
      const mousemove = function(d: Bin) {
        tooltip.html(
          `<b>${d.date}</b><br/>` +
            "Number of attempts: " +
            d.value +
            "<br/>" +
            "Sends: " +
            "0"
        )
        // These don't work yet, given my nested Array data structure
        // .style("left", d3.mouse(this)[0] + 70 + "px")
        // .style("top", d3.mouse(this)[1] + "px")
      }
      const mouseleave = function(d: Bin) {
        tooltip.style("opacity", 0.2)
      }

      const svg = d3
        /** create an empty sub-selection */
        .select(d3Container.current)

      const g = svg
        .selectAll("g")
        .data(data)
        .join(
          enter => enter.append("g"),
          update => update,
          exit => exit.remove()
        )
        /** translate X of the columns, based on the week */
        .attr(
          "transform",
          (d: Week, i) =>
            `translate(${i * (HEIGHT + MARGIN) + STROKE_MARGIN},0)`
        )

      const rects = g
        .selectAll("rect")
        /** past nested data to <rect> children */
        .data(function(d: Week, i) {
          return d
        })

      rects
        .join(
          enter => enter.append("rect"),
          update => update,
          exit => exit.remove()
        )
        .attr("width", HEIGHT)
        .attr("height", HEIGHT)
        /** offset Y, based on the day */
        .attr("y", (d, i) => {
          return i * (HEIGHT + MARGIN) + STROKE_MARGIN
        })
        .attr("data-count", d => d.value)
        .attr("data-date", d => d.date)
        .attr("fill", d =>
          isDarkMode ? myDarkColor(d.value) : myColor(d.value)
        )
        .on("mouseover", function(e) {
          mouseover(e)
        })
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }
  }, [data, d3Container.current, isDarkMode])

  // prettier-ignore
  return (
    <>
      <h2>Heatmap</h2>
      
      <HeatmapContainer>
        <Svg className="d3-component" ref={d3Container} />
      </HeatmapContainer>
      <Tooltip ref={tooltipRef}></Tooltip>
    </>
  )
}

// Heatmap.getInitialProps = async ({ req }): Promise<{ data: Week[] }> => {
//   const data = Array(365) // [0...364]
//     .fill(null)
//     .map((e, i) => {
//       const time = new Date().getTime() - ms(`${364 - i} days`)
//       const month = new Date(time).getMonth() + 1
//       const date = new Date(time).getDate()
//       const year = new Date(time).getFullYear()

//       return {
//         value: Math.floor(Math.random() * 100),
//         date: `${month}-${date}-${year}`,
//       }
//     })
//   return {
//     data: _.chunk(data, 7) as Week[],
//   }
// }

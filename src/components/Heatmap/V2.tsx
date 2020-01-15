import { useRef, useEffect } from "react"
import * as d3 from "d3"
import _ from "lodash"
import styled from "styled-components"
import { animated } from "react-spring"
import { useSelector } from "react-redux"
import { html } from "common-tags"

import { RootState } from "../../state"
import { Colors } from "../../consts/Colors"

export interface Attempt {
  id: string
  grade: number
  send: boolean
}

export interface Bin {
  /** @TODO */
  attempts: Attempt[]
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
  overflow-x: hidden;

  @media (min-width: 768px) {
  }
  /* Large devices (desktops, less than 1200px) */
  @media (max-width: 1199.98px) {
  }
  /* Medium devices (tablets, less than 992px) */
  @media (max-width: 991.98px) {
  }
  /* Small devices (landscape phones, less than 768px) */
  @media (max-width: 767.98px) {
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
  }
  /* Extra small devices (portrait phones, less than 576px) */
  @media (max-width: 575.98px) {
  }
`
const Svg = styled(animated.svg)`
  padding: 10px;
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  /* margin-left: auto; */
  /* margin-right: auto; */

  /* TODO */
  width: 690px;
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
  .domain([0, 10])
  .range([BASE_LIGHT, LIGHT])
const myDarkColor = d3
  .scaleLinear<string, string>()
  .domain([0, 10])
  .range([BASE_DARK, DARK])

export default function Heatmap({ data }: Props) {
  const d3Container = useRef(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)

  const mousemove = function(d: Bin) {
    const tooltip = tooltipRef.current
    // if (!tooltip) return

    const timestamp = new Date(d.date)
    const year = timestamp.getFullYear()
    const month = timestamp.getMonth() + 1
    const date = timestamp.getDate()
    const display = `${month}-${date}-${year}`

    /**
     * group together based on grade (0-10)
     */
    const attemptMap: _.Dictionary<Attempt[]> = _.groupBy(
      d.attempts,
      o => o.grade
    )
    /**
     * array of attemptMap keys to access the value pairs
     */
    const grades = _.keys(attemptMap)

    const dateHtml = html`
      <div><h3>${display}</h3></div>
    `
    const attemptsHtml = grades
      .reverse() // reverse to map drawing Pyramid UI easier
      .map(grade => {
        /**
         * group already graded attempts, by send
         * - at index [0]: send === true
         * - at index [1]: send === false
         */
        const attemptsGradedAndGroupedBySend = _.partition(
          attemptMap[grade],
          "send"
        )

        const sends = attemptsGradedAndGroupedBySend[0].length
        const fails = attemptsGradedAndGroupedBySend[1].length
        return html`
          <div
            style="display: flex; flex-direction: row; width: 300px; align-items: center; height: 2rem"
          >
            <div style="min-width: 2rem;">
              V${grade}
            </div> 
            <div
              style="display: flex; flex-direction: row; width: 250px; border: 1px solid lightgrey; border-radius: 5px; overflow: hidden;"
            >
              <div style="display: flex; flex: ${sends}; justify-content: center; background-color: green">
                ${sends !== 0 && sends}
              </div>
              <div style="display: flex; flex: ${fails}; justify-content: center; background-color: grey">
                ${fails !== 0 && fails}
              </div>
            </div>
            </div>
          </div>
        `
      })
      .join("")

    tooltip.innerHTML = dateHtml + attemptsHtml
    // These don't work yet, given my nested Array data structure
    // .style("left", d3.mouse(this)[0] + 70 + "px")
    // .style("top", d3.mouse(this)[1] + "px")
  }

  useEffect(() => {
    console.log(data)
    if (data && d3Container.current) {
      const tooltip = d3
        .select(tooltipRef.current)
        .style("opacity", 0)
        .attr("class", "tooltip")

      // the mouse event handlers can be moved outside
      // - see `mousemove`
      const mouseover = function(d: Bin) {
        tooltip.style("opacity", 1)
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
        .attr("data-count", d => d.attempts?.length ?? 0)
        .attr("data-date", d => d.date)
        .attr("fill", d => {
          const value = d.attempts?.length ?? 0
          return isDarkMode ? myDarkColor(value) : myColor(value)
        })
        .on("mouseover", function(e) {
          mouseover(e)
        })
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }
  }, [data, d3Container.current, isDarkMode])

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

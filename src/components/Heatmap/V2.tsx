import { useRef, useEffect } from "react"
import * as d3 from "d3"
import _ from "lodash"
import styled from "styled-components"
import { animated, useSprings } from "react-spring"
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

const Total = styled(animated.div)`
  display: flex;
  justify-content: center;
`
const Sends = styled(animated.div)`
  display: flex;
  justify-content: center;
`
const Tooltip = styled(animated.div)`
  border: solid;
  border-color: lightgrey;
  border-width: 1px;
  border-radius: 0.2rem;
  padding: 5px;

  display: flex;
  width: 400px;

  margin-right: auto;
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

const DOMAIN = [0, 40]
/**
 * @usage
 * ```ts
 * .attr("fill", d => myColor(d.value))
 */
const myColor = d3
  .scaleLinear<string, string>()
  .domain(DOMAIN)
  .range([BASE_LIGHT, LIGHT])
const myDarkColor = d3
  .scaleLinear<string, string>()
  .domain(DOMAIN)
  .range([BASE_DARK, DARK])

export default function Heatmap({ data }: Props) {
  const d3Container = useRef(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const refs = Array(11)
    .fill(null)
    .map((e, i) => useRef<HTMLDivElement>(null))

  const maxAttempts = useRef(0)
  const [springs, set] = useSprings(refs.length, index => ({
    opacity: 0.2,
    backgroundColor: isDarkMode ? Colors.geistPurple : Colors.geistCyan,
    sendWidth: `0%`,
    totalWidth: `0%`,
  }))

  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)

  const mouseover = function(d: Bin) {
    const attemptMap = _.groupBy(d.attempts, o => o.grade)
    const grades = _.keys(attemptMap)
    set(i => grades.includes(`${i}`) && { opacity: 1 })
  }
  const mouseleave = function(d: Bin) {
    const attemptMap = _.groupBy(d.attempts, o => o.grade)
    const grades = _.keys(attemptMap)
    set(
      i =>
        grades.includes(`${i}`) && {
          opacity: 0,
          sendWidth: `0%`,
          totalWidth: `0%`,
        }
    )
    maxAttempts.current = 0
  }
  const mousemove = function(d: Bin) {
    const tooltip = tooltipRef.current

    const timestamp = new Date(d.date)
    const year = timestamp.getFullYear()
    const month = timestamp.getMonth() + 1
    const date = timestamp.getDate()
    const display = `${month}-${date}-${year}`
    tooltip.innerHTML = html`
      <div>${display}</div>
    `

    /**
     * group together based on grade (0-10)
     */
    const attemptMap: _.Dictionary<Attempt[]> = _.groupBy(
      d.attempts,
      o => o.grade
    )
    /**
     * array of attemptMap keys to access the value pairs
     * [0...10]
     */
    const grades = _.keys(attemptMap)
    set(
      i =>
        grades.includes(`${i}`) && {
          opacity: 1,
          // width: `100%`,
          backgroundColor: isDarkMode ? Colors.geistPurple : Colors.geistCyan,
        }
    )

    grades
      .slice()
      .reverse()
      .map(grade => {
        // [10...0]

        const attemptsGradedAndGroupedBySend = _.partition(
          attemptMap[grade],
          "send"
        )
        const sends = attemptsGradedAndGroupedBySend[0].length
        const fails = attemptsGradedAndGroupedBySend[1].length
        const total = sends + fails
        if (total >= maxAttempts.current) {
          maxAttempts.current = total
        }
        const percent = (sends / (sends + fails)) * 100

        set(
          i =>
            `${i}` === grade && {
              sendWidth: `${percent}%`,
              totalWidth: `${(total / maxAttempts.current) * 100}%`,
            }
        )
        refs.slice().reverse()[
          grade
        ].current.innerHTML = /** `V${grade}: ${sends}, ${fails}` */ `<code>${sends} : ${fails}</code>`
      })

    // These don't work yet, given my nested Array data structure
    // .style("left", d3.mouse(this)[0] + 70 + "px")
    // .style("top", d3.mouse(this)[1] + "px")
  }

  useEffect(() => {
    if (data && d3Container.current) {
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
        /** @TODO - buggy */
        // .attr("tabindex", "0")
        // .on("focus", mousemove)
        // .on("blur", mouseleave)
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
      {springs
        .slice()
        .reverse()
        .map((props, i) => (
          <div key={i} style={{ display: "flex", overflowY: `hidden` }}>
            <div style={{ width: `40px` }}>V{refs.length - 1 - i}</div>
            <div
              style={{
                display: `flex`,
                justifyContent: `center`,
                backgroundColor: isDarkMode
                  ? Colors.blackDark
                  : Colors.silverLight,
                width: `200px`,
                height: 21,
              }}
            >
              <Total
                style={{
                  width: props.totalWidth,
                  backgroundColor: isDarkMode
                    ? Colors.blackLighter
                    : Colors.silverDarker,
                }}
              >
                <Sends
                  style={{
                    width: props.sendWidth,
                    ...props,
                  }}
                >
                  <div style={{ position: `absolute` }} ref={refs[i]}>
                    ?
                  </div>
                </Sends>
              </Total>
            </div>
          </div>
        ))}
    </>
  )
}

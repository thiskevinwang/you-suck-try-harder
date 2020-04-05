import { useRef, useEffect } from "react"
import * as d3 from "d3"
import _ from "lodash"
import styled, { BaseProps } from "styled-components"
import { animated, useSprings } from "react-spring"
import { useSelector } from "react-redux"

import { RootState } from "state"
import { Colors } from "consts/Colors"
import { Spacer } from "components/Spacer"

import {
  Tooltip,
  Total,
  Sends,
  HeatmapContainer,
  HeatmapInner,
  Svg,
  HEIGHT,
  MARGIN,
  STROKE_MARGIN,
  OFFSET_LEFT,
} from "./styles"

const GRADES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
export interface Attempt {
  id: string
  grade: number
  send: boolean
  date: Date
  user: {
    id: number
  }
}

export interface Bin {
  /** @TODO */
  attempts: Attempt[]
  date: string
}
type Week = [Bin, Bin, Bin, Bin, Bin, Bin, Bin]
export interface Props {
  data?: Week[]
}

/**
 * util func
 * @see https://observablehq.com/@d3/calendar-view
 *
 * @param d u
 */
const formatDay = (d: Date) =>
  ["", "Mon", "", "Wed", "", "Fri", ""][d.getUTCDay()]

const countDay = (d) => (d.getUTCDay() + 6) % 7

const BASE_LIGHT = Colors.silver
const BASE_DARK = Colors.black
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

/**
 * the `data` prop is `_.chunk(..., 7)`'d
 */
export default function Heatmap({ data }: Props) {
  const d3Container = useRef(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const refs = GRADES.map((e, i) => useRef<HTMLDivElement>(null))

  const [springs, set] = useSprings(refs.length, (index) => ({
    opacity: 0.2,
    backgroundColor: isDarkMode ? Colors.geistPurple : Colors.geistCyan,
    sendWidth: `0%`,
    sends: 0,
    totalWidth: `0%`,
    total: 0,
  }))

  const isDarkMode = useSelector((state: RootState) => state.isDarkMode)

  const mouseover = function (d: Bin) {
    const attemptMap = _.groupBy(d.attempts, (o) => o.grade)
    const grades = _.keys(attemptMap)
    set((i) => (grades.includes(`${i}`) ? { opacity: 1 } : { opacity: 0 }))
  }
  const mouseleave = function (d: Bin) {
    const attemptMap = _.groupBy(d.attempts, (o) => o.grade)
    const grades = _.keys(attemptMap)
    set(
      (i) =>
        grades.includes(`${i}`) && {
          opacity: 0,
          sendWidth: `0%`,
          sends: 0,
          totalWidth: `0%`,
          total: 0,
          delay: 500,
        }
    )
  }
  const mousemove = function (d: Bin) {
    const tooltip = tooltipRef.current

    const timestamp = new Date(d.date)
    const year = timestamp.getFullYear()
    const month = timestamp.getMonth() + 1
    const date = timestamp.getDate()
    const display = `${month}-${date}-${year}`
    tooltip.innerHTML = display

    /**
     * group together based on grade (0-10)
     */
    const attemptMap = _.groupBy(d.attempts, (o) => o.grade)
    /**
     * array of attemptMap keys to access the value pairs
     * [0...10]
     */
    const grades = _.keys(attemptMap)

    const lookup = _.keyBy(grades)
    const missingGrades = _.filter(GRADES, (g) => {
      return lookup[g] !== g
    })

    set(
      (i) =>
        grades.includes(`${i}`) && {
          opacity: 1,
          backgroundColor: isDarkMode ? Colors.geistPurple : Colors.geistCyan,
        }
    )
    // set(
    //   (i) =>
    //     missingGrades.includes(`${i}`) && {
    //       opacity: 0,
    //       backgroundColor: isDarkMode ? Colors.geistPurple : Colors.geistCyan,
    //     }
    // )

    grades
      .slice()
      .reverse()
      .map((grade) => {
        // [10...0]

        const attemptsGradedAndGroupedBySend = _.partition(
          attemptMap[grade],
          "send"
        )
        const sends = attemptsGradedAndGroupedBySend[0].length
        const fails = attemptsGradedAndGroupedBySend[1].length
        const total = sends + fails

        const percent = (sends / total) * 100
        // console.log(`V${grade}:`, `( ${sends} / ${total} )`, `${percent}%`)

        set(
          (i) =>
            `${i}` === grade && {
              sendWidth: `${percent}%`,
              sends,
              totalWidth: `100%`,
              total,
            }
        )
        refs.slice().reverse()[grade].current.innerHTML = `${sends} / ${total}`
      })
    missingGrades
      .slice()
      .reverse()
      // [10...0]
      .map((grade) => {
        /* RESET to 0 */
        set(
          (i) =>
            `${i}` === grade && {
              sendWidth: `${0}%`,
              sends: 0,
              totalWidth: `0%`,
              total: 0,
              delay: 300,
            }
        )
        refs.slice().reverse()[grade].current.innerHTML = `-`
      })
  }

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3
        /** create an empty sub-selection */
        .select(d3Container.current)

      /**
       * Mon Wed Fri labels
       */
      svg
        .append("g")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(d3.range(7).map((i) => new Date(1995, 0, i + 1)))
        .join("text")
        .attr("fill", isDarkMode ? "white" : "black")
        .attr("class", "wday")
        .attr("x", -5)
        // .attr("y", d => (countDay(d) + 0.5) * 17)
        .attr("y", (d, i) => {
          return (i + 1) * (HEIGHT + MARGIN) + STROKE_MARGIN
        })
        .attr("dy", HEIGHT)
        // .attr("dx", -10)
        .attr("font-size", HEIGHT)
        .text(formatDay)

      const columns = svg
        .selectAll("g")
        .data(data)
        .join(
          (enter) => enter.append("g"),
          (update) => update,
          (exit) => exit.remove()
        )
        /** translate X of the columns, based on the week */
        .attr(
          "transform",
          (d: Week, i) =>
            /* (i + 1): offset the first column */
            `translate(${
              (i + OFFSET_LEFT) * (HEIGHT + MARGIN) + STROKE_MARGIN
            },0)`
        )

      /** Create the Month labels */
      svg
        .selectAll(".columnLabel")
        .data(data)
        .join(
          (enter) => enter.append("text"),
          (update) => update,
          (exit) => exit.remove()
        )
        .attr("class", "month")
        .text((currWeek: Week, i) => {
          const currDay = _.first(currWeek)
          const currDateString = currDay.date
          // check the month of the first element of the matrix member
          const currMonth = new Date(currDateString).getMonth()

          // when looking at the very first column,
          // check if the next column is a different month
          if (i === 0) {
            const nextWeek = data[i + 1]
            const nextDay = _.first(nextWeek)
            const nextDateString = nextDay.date
            const nextMonth = new Date(nextDateString).getMonth()
            // if the next month is different, don't display the
            // current month, or else the text will be cramped
            if (currMonth !== nextMonth) return ""
          }
          /* @TODO repeat same above logic for 2nd column */

          // it doesn't look like d3 has a `Array.map` capability,
          // so there's not an easy way to iterate through and hold
          // a "currentMonth" counter
          //
          // instead, for each column, we can check the previous
          // column, and see if it is the same/different month
          const prevWeek = data[i - 1]
          const prevDay = _.first(prevWeek)
          const prevDateString = prevDay?.date
          const prevMonth = prevDateString
            ? new Date(prevDateString).getMonth()
            : -1
          // don't display if the previous column is the same month
          // this will only display month labels for the first column
          // of a month
          if (currMonth === prevMonth) return ""
          // prettier-ignore
          switch (currMonth) {
            case 0: return "Jan"
            case 1: return "Feb"
            case 2: return "Mar"
            case 3: return "Apr"
            case 4: return "May"
            case 5: return "Jun"
            case 6: return "Jul"
            case 7: return "Aug"
            case 8: return "Sep"
            case 9: return "Oct"
            case 10: return "Nov"
            case 11: return "Dec"
            default: return
          }
        })
        .attr("fill", isDarkMode ? "white" : "black")
        .attr("font-size", HEIGHT)
        .attr("y", HEIGHT)
        .attr("x", (d, i) => {
          return (i + OFFSET_LEFT) * (HEIGHT + MARGIN) + STROKE_MARGIN
        })

      const squares = columns
        .selectAll("rect")
        /** past nested data to <rect> children */
        .data((d: Week) => d)
        .join(
          (enter) => enter.append("rect"),
          (update) => update,
          (exit) => exit.remove()
        )
        .attr("width", HEIGHT)
        .attr("height", HEIGHT)
        /** offset Y, based on the day */
        .attr("y", (d, i) => {
          return (i + 1) * (HEIGHT + MARGIN) + STROKE_MARGIN
        })
        .attr("data-count", (d) => d.attempts?.length ?? 0)
        .attr("data-date", (d) => d.date)
        .attr("fill", (d) => {
          const value = d.attempts?.length ?? 0
          return isDarkMode ? myDarkColor(value) : myColor(value)
        })
        /** @TODO - buggy */
        // .attr("tabindex", "0")
        // .on("focus", mousemove)
        // .on("blur", mouseleave)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }
  }, [data, d3Container.current, isDarkMode])

  return (
    <>
      <HeatmapContainer>
        <HeatmapInner>
          <Svg className="d3-component" ref={d3Container} />
        </HeatmapInner>
      </HeatmapContainer>
      <Tooltip ref={tooltipRef}>
        &nbsp;-&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;
      </Tooltip>
      {springs
        .slice()
        .reverse()
        .map((props, i) => {
          const grade = refs.length - 1 - i
          return (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <VGrade>
                <small>V{grade}</small>
              </VGrade>
              <Spacer x={10} />
              <animated.div
                style={{
                  display: `flex`,
                  backgroundColor: isDarkMode
                    ? Colors.blackDark
                    : Colors.silverLight,
                  // height: 18,
                  width: props.total.interpolate((a) => {
                    return (a + 1) * 30
                  }),
                }}
              >
                <Total style={{ width: props.totalWidth }}>
                  <Sends style={{ width: props.sendWidth, ...props }}></Sends>
                </Total>
                <Spacer x={5} />
                <small style={{ minWidth: 30 }} ref={refs[i]}>
                  ?
                </small>
              </animated.div>
            </div>
          )
        })}
    </>
  )
}

const VGrade = styled(animated.div)`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dotted ${(p: BaseProps) => p.theme.commentRenderer.borderColor};
  border-radius: 50%;
  margin-top: 2px;
  margin-bottom: 2px;
`

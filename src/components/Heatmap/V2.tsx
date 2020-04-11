import { useRef, useEffect, MutableRefObject, createRef } from "react"
import * as d3 from "d3"
import _ from "lodash"
import styled, { BaseProps } from "styled-components"
import { animated, useSprings } from "react-spring"
import { useDrag } from "react-use-gesture"
import useMeasure from "react-use-measure"
import { useSelector } from "react-redux"
import Link from "next/link"

import { RootState } from "state"
import { Colors } from "consts/Colors"
import { CreateAttempt } from "components/CreateAttempt"
import { Spacer } from "components/Spacer"
import { useAuthentication } from "hooks/useAuthentication"
import { Square } from "icons"

import { StatusBars } from "./StatusBars"
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

const BASE_LIGHT = Colors.silverDarker
const BASE_DARK = Colors.greyDarker
const LIGHT = Colors.geistCyan
const DARK = Colors.geistPurple

const myColor = d3
  .scaleLinear<string, string>()
  .domain([0, 40])
  .range([BASE_LIGHT, LIGHT])
const myDarkColor = d3
  .scaleLinear<string, string>()
  .domain([0, 40])
  .range([BASE_DARK, DARK])

/**
 * the `data` prop is `_.chunk(..., 7)`'d
 */
export default function Heatmap({ data }: Props) {
  const d3ref = useRef(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const refs = GRADES.map((e, i) => createRef<HTMLDivElement>())

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

  const updateDateLabel = (d: Bin, ref: MutableRefObject<HTMLDivElement>) => {
    const timestamp = new Date(d.date)
    const year = timestamp.getFullYear()
    const month = timestamp.getMonth() + 1
    const date = timestamp.getDate()
    const display = `${month}-${date}-${year}`
    ref.current.innerHTML = display
  }

  const mousemove = function (d: Bin) {
    updateDateLabel(d, tooltipRef)

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

    const r = [...refs].reverse()
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

        if (r[grade].current && r[grade].current.innerHTML) {
          r[grade].current.innerHTML = `${sends} / ${total}`
        }
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
        if (r[grade].current) {
          r[grade].current.innerHTML = `-`
        }
      })
  }

  useEffect(() => {
    if (data && d3ref.current) {
      /** create an empty sub-selection */
      const svg = d3.select(d3ref.current)

      /** create "Mon Wed Fri" labels */
      svg
        .append("g")
        .attr("text-anchor", "end")
        .selectAll("text")
        .data(d3.range(7).map((i) => new Date(1995, 0, i + 1)))
        .join("text")
        .attr("fill", isDarkMode ? "white" : "black")
        .attr("class", "wday")
        .attr("x", -5)
        .attr("y", (d, i) => (i + 1) * (HEIGHT + MARGIN) + STROKE_MARGIN)
        .attr("dy", HEIGHT)
        // .attr("dx", -10)
        .attr("font-size", HEIGHT)
        .text((d) => ["", "Mon", "", "Wed", "", "Fri", ""][d.getUTCDay()])

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

      /* GENERATE SQUARES */
      columns
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
        .attr("y", (d, i) => (i + 1) * (HEIGHT + MARGIN) + STROKE_MARGIN)
        .attr("data-count", (d) => d.attempts?.length ?? 0)
        .attr("data-date", (d) => d.date)
        .attr("fill", (d) => {
          const value = d.attempts?.length ?? 0
          return isDarkMode ? myDarkColor(value) : myColor(value)
        })
        .attr("tabindex", "0")
        .on("focus", mousemove)
        .on("blur", mouseleave)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }
  }, [data, d3ref.current, isDarkMode])

  const { currentUserId } = useAuthentication()
  const [measureRef1, bounds1] = useMeasure()
  const [measureRef2, bounds2] = useMeasure()
  const { props, bind } = usePager(bounds1.width)

  return (
    <>
      <HeatmapContainer>
        <HeatmapInner>
          <Svg className="d3-component" ref={d3ref} />
        </HeatmapInner>
      </HeatmapContainer>
      <Tooltip ref={tooltipRef}>
        &nbsp;-&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;
      </Tooltip>
      {/*<StatusBars springs={springs} refs={refs} />*/}
      <div
        style={{
          position: "relative",
          height: _.max([bounds1.height, bounds2.height]),
        }}
      >
        <PagerWrapper
          style={{ height: _.max([bounds1.height, bounds2.height]) }}
        >
          {props.map(({ x, display, scale, opacity }, i) => (
            <PagerGestureHandler
              // {...bind()}
              // ref={measureRef}
              key={i}
              style={{ display, x }}
            >
              <PagerItem style={{ scale, opacity }}>
                {i === 0 ? (
                  <div ref={measureRef1} style={{ padding: "1rem" }}>
                    <DragWrapper {...bind()}>
                      <Square />
                    </DragWrapper>
                    <StatusBars springs={springs} refs={refs} />
                  </div>
                ) : (
                  <div ref={measureRef2} style={{ padding: "1rem" }}>
                    <DragWrapper {...bind()}>
                      <Square />
                    </DragWrapper>
                    <h3>Log Attempt(s)</h3>
                    {currentUserId ? (
                      <CreateAttempt currentUserId={currentUserId} />
                    ) : (
                      <>
                        Please&nbsp;
                        <Link href="/auth/login">
                          <a>Login</a>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </PagerItem>
            </PagerGestureHandler>
          ))}
        </PagerWrapper>
      </div>
      <Spacer y={40} />
    </>
  )
}

const DragWrapper = styled(animated.div)`
  display: flex;
  justify-content: center;

  cursor: grab;
  :active {
    cursor: grabbing;
  }
`

/**
 * GIVE ME HEIGHHT
 */
const PagerWrapper = styled(animated.div)`
  border: 1px solid ${(p: BaseProps) => p.theme.commentRenderer.borderColor};
  border-radius: 5px;
  overscroll-behavior-y: contain;
  user-select: none;
  position: absolute;
  overflow: hidden;
  width: 100%;
`

/**
 * MEASURE ME
 */
const PagerGestureHandler = styled(animated.div)`
  /* border: 3px dotted red; */
  position: absolute;
  width: 100%;
  /* height: 360px; */
  willchange: transform;
`

const PagerItem = styled(animated.div)`
  /* border: 3px dashed green; */
  height: 100%;
  width: 100%;

  /* padding-left: 1rem; */
  /* padding-right: 1rem; */
`

const usePager = (width, pages = [null, null]) => {
  const index = useRef(0)
  const [props, set] = useSprings(pages.length, (i) => ({
    x: (i * width) / 2,
    scale: 1,
    display: "block",
    opacity: i === 0 ? 1 : 0,
  }))
  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (down && distance > width / 4) {
        cancel()

        index.current = _.clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          pages.length - 1
        )
      }

      set((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: "none" }

        const x = (i - index.current) * width + (down ? mx : 0)
        const scale = down ? 1 - distance / width / 2 : 1
        return {
          x,
          scale,
          display: "block",
          opacity: i === index.current ? 1 : 0,
        }
      })
    }
  )
  return { props, bind }
}

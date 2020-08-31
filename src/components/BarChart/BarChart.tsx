import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import ms from "ms"
import * as d3 from "d3"
import _ from "lodash"

import { FieldRenderer as Field } from "components/Form/Field"
import { Spacer } from "components/Spacer"

/**
 * additional ticks, beyond the max y-extent
 */
const Y_TOLERANCE = 2

interface T {
  created: Date // "2020-08-09T03:10:07.813517"
  date: Date // "2020-08-04T23:10:07.782"
  grade: number // 10
  id: string // "4fe1660e-b309-4ce9-9288-d40fa50a4290"
  updated: Date // "2020-08-09T03:10:07.813517"
  user_id: string // "a5f5d36a-6677-41c2-85b8-7578b4d98972"
}

const WIDTH = 960
const HEIGHT = 500
const MARGIN = 5
const PADDING = 5
const ADJ = 30

// **************
// *** SCALES ***
// **************

/**
 * Left-to-Right
 */
const X_SCALE = d3.scaleTime().rangeRound([0, WIDTH])
/**
 * Top-to-Bottom
 */
const Y_SCALE = d3.scaleLinear().rangeRound([HEIGHT, 0])

export const BarChart = () => {
  // ===================================================================
  const [start, setStart] = useState(() => {
    let now = new Date()
    let nowTime = now.getTime()

    return new Date(nowTime - ms("365 day")).getTime()
  })
  const [end, setEnd] = useState(() => {
    let now = new Date()
    return now.getTime()
  })

  const [limit, setLimit] = useState("100")
  const [offset, setOffset] = useState("0")

  const [data, setData] = useState<T[]>([])

  const memoizedThrottledFetch = useCallback(
    _.throttle((start, end, limit, offset) => {
      const userId = "a5f5d36a-6677-41c2-85b8-7578b4d98972"
      fetch(
        `http://localhost:3000/users/${userId}/attempts?limit=${limit}&offset=${offset}&start=${start}&end=${end}`
      )
        .then((r) => r.json())
        .then((d) => setData(d))
    }, 100),
    [setData]
  )

  useEffect(() => {
    memoizedThrottledFetch(start, end, limit, offset)
  }, [start, end, limit, offset, memoizedThrottledFetch])

  const makeHandleSetTime = (
    setterFn: React.Dispatch<React.SetStateAction<number>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.valueAsNumber
    setterFn(time)
  }

  const divContainerRef = useRef()
  // var alphabet = useMemo(() => "abcdefghijklmnopqrstuvwxyz".split(""), [])
  // const update = useCallback(
  //   (data) => {
  //     var svg = d3.select(divContainerRef.current)

  //     var g = svg.select(".ALPHABET").empty()
  //       ? svg.append("g").attr("class", "ALPHABET")
  //       : svg.select(".ALPHABET")
  //     var t = d3.transition().duration(750)

  //     // JOIN new data with old elements.
  //     var text = g.selectAll("text").data(data, function (d) {
  //       return d
  //     })

  //     // EXIT old elements not present in new data.
  //     text
  //       .exit()
  //       .attr("class", "exit")
  //       .transition(t)
  //       .attr("y", 60)
  //       .style("fill-opacity", 1e-6)
  //       .remove()

  //     // UPDATE old elements present in new data.
  //     text
  //       .attr("class", "update")
  //       .attr("y", 0)
  //       .style("fill-opacity", 1)
  //       .transition(t)
  //       .attr("x", (d, i) => i * 32)

  //     // ENTER new elements present in new data.
  //     text
  //       .enter()
  //       .append("text")
  //       .attr("class", "enter")
  //       .attr("dy", ".35em")
  //       .attr("y", -60)
  //       .attr("x", function (d, i) {
  //         return i * 32
  //       })
  //       .style("fill-opacity", 1e-6)
  //       .text((d) => d)
  //       .transition(t)
  //       .attr("y", 0)
  //       .style("fill-opacity", 1)
  //   },
  //   [divContainerRef.current]
  // )
  // useEffect(() => {
  //   update(alphabet)
  //   d3.interval(function () {
  //     update(
  //       d3
  //         .shuffle(alphabet)
  //         .slice(0, Math.floor(Math.random() * 26))
  //         .sort()
  //     )
  //   }, 1500)
  // }, [alphabet])

  useEffect(() => {
    const svg = d3.select(divContainerRef.current)

    svg
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        `-${ADJ} -${ADJ}` + " " + `${WIDTH + ADJ * 3} ${HEIGHT + ADJ * 5}`
      )
      .style("padding", PADDING)
      .style("margin", MARGIN)
    // .classed("svg-content", true)

    /* https://github.com/d3/d3-array/blob/master/README.md#extent */
    const xExtent = d3.extent(data, (d) => {
      return new Date(d.date)
    })

    /**
     * This limits the domain of the x-axis
     */
    X_SCALE.domain(xExtent)

    /**
     * From a UI/UX perspective,the max will always be max data value + 2
     */
    const yMax = d3.max(data, (d) => {
      return d.grade + Y_TOLERANCE
    })
    /**
     * * From a UI/UX perspective, the min should scale, but non-linearly.
     * * One idea is to scale logarithmically.
     * * The intent is so that as you approach data that is "larger", the domain
     * grows wider—but not "obnoxiously"—and conveys a sense of grandeur.
     */
    const yMin = d3.min(data, (d) => {
      const max = d3.max(data, (d) => d.grade as number)
      return d.grade - Math.log(max) * Math.log(max)
    })

    /**
     * @WARN This mutates the D3 Scale.
     */
    Y_SCALE.domain([0, yMax]).range([HEIGHT, 0])

    /**
     * The y-axis
     */
    const yaxis = d3.axisLeft(Y_SCALE)

    /**
     * The x-axis
     */
    const xaxis = d3.axisBottom(X_SCALE)

    /**
     * create x-axis ticks
     */
    xaxis
      /* https://github.com/d3/d3-axis/blob/master/README.md#axis_ticks */
      // .ticks(d3.timeHour.every(4))
      .ticks(20)
      /* https://github.com/d3/d3-axis/blob/master/README.md#axis_tickFormat */
      .tickFormat((dt) => {
        switch (new Date(dt as any).getHours()) {
          case 0:
            return d3.timeFormat("%b %d %Y")(dt as Date)
          case 12:
            return "Noon"
          default:
            return d3.timeFormat("%H:%M")(dt as Date)
        }
      })
    // .tickSizeInner(6)
    // .tickSizeOuter(10)

    /**
     * GET OR CREATE X Axis line
     * Defaults to top
     */
    const xAxisSvg = svg.select(".x-axis-svg").empty()
      ? svg
          .append("g")
          .attr("class", "x-axis-svg")
          // Position X Axis line at bottom
          .attr("transform", "translate(0," + HEIGHT + ")")
      : svg.select(".x-axis-svg")

    xAxisSvg.transition().call(xaxis).attr("font-size", "16px")
    // Rotate tick labels
    xAxisSvg
      .selectAll("text")
      .attr("dx", "3em")
      .attr("dy", "1em")
      .attr("text-align", "left")
      .attr("transform", "rotate(45)")

    // Add X Axis Label: "Date"
    let xAxisLabel = xAxisSvg.append("g").attr("class", "x-axis-label")
    xAxisLabel = xAxisSvg.append("text").attr("class", "x-axis-label")
    xAxisLabel
      .attr("dy", "-.75em")
      .attr("dx", `${WIDTH}px`)
      .style("text-anchor", "end")
      .text("Date")

    /**
     * GET OR CREATE y axis (same applies for x axis)
     * @WARN This is super important when trying to get transitions working with useEffect
     *
     * 1. (no animations) You can remove the `appended` element on effect-cleanup to avoid 1000 duplicates
     * 2. (correct) Check if the element was previously created via `.empty()
     *   - if not (likely the very first effect loop) append it
     *   - if yes, select that instead of appending.
     */
    const yAxisSvg = svg.select(".y-axis-svg").empty()
      ? svg.append("g").attr("class", "y-axis-svg")
      : svg.select(".y-axis-svg")
    yAxisSvg.transition().call(yaxis).attr("font-size", "16px")

    // Add Y Axis Label: "Seconds"
    let yAxisLabel = yAxisSvg.append("g").attr("class", "y-axis-label")
    yAxisLabel = yAxisSvg.append("text").attr("class", "y-axis-label")
    yAxisLabel
      .attr("transform", "rotate(-90)")
      .attr("dy", ".75em")
      .attr("y", 6)
      .style("text-anchor", "end")
      .text("Seconds")

    /**
     * Create a update selection: bind to the new data
     * @see https://www.d3-graph-gallery.com/graph/line_change_data.html
     *
     * Somethings cannot be interpolated, like creation of elements
     * @see https://bost.ocks.org/mike/transition/
     */

    let line = d3
      .line()
      .x((d: any) => X_SCALE(new Date(d.date)))
      .y((d: any) => Y_SCALE(d.grade))
      .curve(d3.curveStepAfter)

    // Draw line
    // I don't think this can be interpolated.
    svg
      .selectAll(".my-line")
      .data([data])
      .join(
        (enter) => {
          return enter
            .append("path")
            .attr("class", "my-line")
            .attr("fill", "none")
            .attr("stroke-dasharray", 2)
            .attr("stroke", "var(--opposite")
            .attr("opacity", 0.5)
            .attr("d", line(data))
        },
        (update) => update,
        (exit) => exit.remove()
      )

    /**
     * GET OR CREATE div tooltip
     */
    const tooltipDiv = !d3.select(".tooltip-wrapper").select(".tooltip").empty()
      ? d3.select(".tooltip-wrapper").select(".tooltip")
      : d3
          .select(".tooltip-wrapper")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("opacity", 0)
          .style("pointer-events", "none")
          .style("border-style", "solid")
          .style("border-color", "var(--opposite)")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("backdrop-filter", "blur(5px)")

    // -------------------Add dots-------------------------
    const radius = 3
    const dots = svg
      .selectAll("dot")
      .data(data)
      .join(
        (enter) => enter.append("circle"),
        (update) => update,
        (exit) => exit.remove()
      )

    dots
      .attr("cx", (d: any) => X_SCALE(new Date(d.date)))
      .attr("cy", (d: any) => Y_SCALE(d.grade))
      .attr("r", radius)
      .attr("cursor", "pointer")
      .style("fill", "var(--opposite")
      .on("mouseover", function (d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", radius * 2)

        const pX = d3.event.pageX
        const pY = d3.event.pageY
        const svgWidth = svg.property("width").baseVal?.value // suffixed with px
        const svgHeight = svg.property("height").baseVal?.value // suffixed with px

        // update div
        tooltipDiv
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("left", `${pX + 28}px`)
          .style("top", `${pY - 28}px`)
          .style(
            "transform",
            `translate(${pX > svgWidth / 2 ? -410 : 0}px, 0%)`
          )
        tooltipDiv.html(`<pre>${JSON.stringify(d, null, 2)}</pre>`)
      })
      .on("mousedown", function () {
        d3.select(this)
          .transition()
          .attr("r", radius * 3)
      })
      .on("mouseup", function () {
        d3.select(this)
          .transition()
          .attr("r", radius * 2)
      })
      .on("mouseout", function (d) {
        d3.select(this).transition().attr("r", radius)

        tooltipDiv
          .transition()
          .style("opacity", 0)
          .style("left", `${d3.event.pageX + 28}px`)
          .style("top", `${d3.event.pageY - 28}px`)
        tooltipDiv.html(`<pre>${JSON.stringify(d, null, 2)}</pre>`)
      })

    return () => {
      svg.selectAll("path").remove()
      svg.selectAll("circle").remove()
      svg.selectAll(".x-axis-label").remove()
      svg.selectAll(".y-axis-label").remove()
    }
  }, [data, divContainerRef.current])
  return (
    <>
      <h1>Data 🔥</h1>
      <div style={{ display: "flex" }}>
        <div>
          <Field>
            <input
              id="start"
              type="date"
              value={new Date(start).toISOString().slice(0, 10)}
              min="2019-01-01"
              max="2020-12-31"
              onChange={makeHandleSetTime(setStart)}
            />
            <label htmlFor="start">Start</label>
          </Field>
          <Spacer y={30} />
          <Field>
            <input
              id="end"
              type="date"
              value={new Date(end).toISOString().slice(0, 10)}
              min="2019-01-01"
              max="2020-12-31"
              onChange={makeHandleSetTime(setEnd)}
            />
            <label htmlFor="end">End</label>
          </Field>
        </div>

        <Spacer x={30} />

        <div>
          <Field>
            <input
              name="limit"
              id="limit"
              type="number"
              // value="2018-07-22"
              value={limit}
              min="0"
              // max="100"
              step="10"
              onChange={(e) => setLimit(e.target.value || 0)}
            />
            <label htmlFor="limit">Limit</label>
          </Field>
          <Spacer y={30} />
          <Field>
            <input
              name="offset"
              id="offset"
              type="number"
              // value="2018-07-22"
              value={offset}
              min="0"
              // max="100"
              step="10"
              onChange={(e) => setOffset(e.target.value || 0)}
            />
            <label htmlFor="offset">Offset</label>
          </Field>
        </div>
      </div>
      <div className={"tooltip-wrapper"}></div>
      <svg ref={divContainerRef}></svg>
    </>
  )
}

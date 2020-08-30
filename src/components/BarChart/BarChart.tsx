import { useEffect, useState, useRef } from "react"
import ms from "ms"
import * as d3 from "d3"

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
const X_SCALE = d3.scaleTime().range([0, WIDTH])
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
  useEffect(() => {
    const userId = "a5f5d36a-6677-41c2-85b8-7578b4d98972"
    fetch(
      `http://localhost:3000/users/${userId}/attempts?limit=${limit}&offset=${offset}&start=${start}&end=${end}`
    )
      .then((r) => r.json())
      .then((d) => setData(d))
  }, [start, end, limit, offset])

  const makeHandleSetTime = (
    setterFn: React.Dispatch<React.SetStateAction<number>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.valueAsNumber
    setterFn(time)
  }

  const divContainerRef = useRef()
  useEffect(() => {
    var t = d3.transition().duration(333)
    // we are appending SVG first
    const svg = d3.select(divContainerRef.current).append("svg")

    svg
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        "-" +
          ADJ +
          " -" +
          ADJ +
          " " +
          (WIDTH + ADJ * 3) +
          " " +
          (HEIGHT + ADJ * 3)
      )
      .style("padding", PADDING)
      .style("margin", MARGIN)
      .classed("svg-content", true)

    if (data && divContainerRef.current) {
      const slices = [
        {
          id: "grade",
          values: data.map((d) => {
            return {
              date: new Date(d.date),
              grade: d.grade,
            }
          }),
        },
      ]

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
      Y_SCALE.domain([yMin, yMax])

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
        .ticks(d3.timeHour.every(4))
        /* https://github.com/d3/d3-axis/blob/master/README.md#axis_tickFormat */
        .tickFormat((dt) => {
          switch (new Date(dt as any).getHours()) {
            case 0:
              return d3.timeFormat("%b %d %Y")(dt as Date)
            case 12:
              return d3.timeFormat("%H:%M")(dt as Date)
          }
        })
        .tickSizeInner(6)
        .tickSizeOuter(10)
        .scale(X_SCALE)

      //-------------------------2. DRAWING----------------------------//

      /**
       * @NOTE Draw X Axis line
       * Defaults to top
       */
      const xAxisSvg = svg
        .append("g")
        .attr("class", "x-axis-svg")
        // Position X Axis line at bottom
        .attr("transform", "translate(0," + HEIGHT + ")")

      // Create x axis
      xAxisSvg.call(xaxis)
      // Rotate tick labels
      xAxisSvg
        .selectAll("text")
        .attr("dx", "2em")
        .attr("dy", "1em")
        .attr("transform", "rotate(45)")

      // Add X Axis Label: "Date"
      let xAxisLabel = xAxisSvg.append("g").attr("class", "x-axis-label")
      xAxisLabel = xAxisSvg.append("text")
      xAxisLabel
        .attr("dy", "-.75em")
        .attr("dx", `${WIDTH}px`)
        .style("text-anchor", "end")
        .text("Date")

      // Create y axis
      const yAxisSvg = svg
        .append("g")
        .attr("class", "y-axis-svg")
        .style("opacity", 1)
      yAxisSvg.call(yaxis)

      // Add Y Axis Label: "Seconds"
      let yAxisLabel = yAxisSvg.append("g").attr("class", "y-axis-label")
      yAxisLabel = yAxisSvg.append("text")
      yAxisLabel
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Seconds")

      // Line
      const line = d3
        .line()
        .x((d: any) => X_SCALE(d.date))
        .y((d: any) => Y_SCALE(d.grade))

      const _lines = svg
        .selectAll("lines")
        .data(slices)
        .join(
          (enter) => {
            // console.log("lines::enter", enter)
            return enter
              .append("g")
              .append("path")
              .attr("fill", "none")
              .attr("stroke-dasharray", 2)
              .attr("stroke", "var(--opposite")
              .attr("opacity", 0.5)
              .attr("d", (d) => line(d.values as any))
          },
          (update) => {
            // console.log("lines::update", update)
            return update
          },
          (exit) => {
            // console.log("lines::exit", exit)
            return exit.remove()
          }
        )

      /**
       * Add div tooltip
       */
      const tooltipDiv = d3
        .select(divContainerRef.current)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("border", "1px solid var(--opposite)")
        .style("border-radius", "5px")
        .style("backdrop-filter", "blur(5px)")

      // -------------------Add dots-------------------------
      const radius = 3
      const dots = svg
        .append("g")
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
            .attr("fill", "orange")
            .attr("r", radius * 2)

          // console.log(d3.event.pageX, d3.event.pageY)

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
            .duration(200)
            .attr("fill", "orange")
            .attr("r", radius * 3)
        })
        .on("mouseup", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "orange")
            .attr("r", radius * 2)
        })
        .on("mouseout", function (d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "orange")
            .attr("r", radius)

          tooltipDiv
            .transition()
            .duration(200)
            .style("opacity", 0)
            .style("left", `${d3.event.pageX + 28}px`)
            .style("top", `${d3.event.pageY - 28}px`)
          tooltipDiv.html(`<pre>${JSON.stringify(d, null, 2)}</pre>`)
        })
    }
    return () => {
      d3.select(divContainerRef.current).selectAll("*").remove().transition(t)
    }
  }, [data, divContainerRef.current])
  return (
    <>
      <h1>Data viz is so hot 🔥</h1>
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
              onChange={(e) => setLimit(e.target.value)}
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
              onChange={(e) => setOffset(e.target.value)}
            />
            <label htmlFor="offset">Offset</label>
          </Field>
        </div>
      </div>
      <div ref={divContainerRef}></div>
    </>
  )
}

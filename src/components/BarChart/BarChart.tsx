import { useEffect, useState } from "react"
import * as d3 from "d3"

/**
 * additional ticks, beyond the max y-extent
 */
const Y_TOLERANCE = 2

export const BarChart = () => {
  // ===================================================================
  const [start, setStart] = useState(() => new Date().getTime())
  const [end, setEnd] = useState(() => {
    let now = new Date()
    var pastDate = now.getDate() - 24
    now.setDate(pastDate)
    return now.getTime()
  })

  const [limit, setLimit] = useState("100")
  const [offset, setOffset] = useState("0")

  const makeHandleSetTime = (
    setterFn: React.Dispatch<React.SetStateAction<number>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.valueAsNumber
    setterFn(time)
  }

  // array of
  // created: "2020-08-09T03:10:07.813517"
  // date: "2020-08-04T23:10:07.782"
  // deleted: null
  // flash: null
  // grade: 10
  // id: "4fe1660e-b309-4ce9-9288-d40fa50a4290"
  // send: true
  // updated: "2020-08-09T03:10:07.813517"
  // user_id: "a5f5d36a-6677-41c2-85b8-7578b4d98972"
  // ===================================================================

  interface T {
    created: Date // "2020-08-09T03:10:07.813517"
    date: Date // "2020-08-04T23:10:07.782"
    grade: number // 10
    id: string // "4fe1660e-b309-4ce9-9288-d40fa50a4290"
    updated: Date // "2020-08-09T03:10:07.813517"
    user_id: string // "a5f5d36a-6677-41c2-85b8-7578b4d98972"
  }
  useEffect(() => {
    const width = 960
    const height = 500
    const margin = 5
    const padding = 5
    const adj = 30
    // we are appending SVG first
    const svg = d3
      .select("div#container")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        "-" +
          adj +
          " -" +
          adj +
          " " +
          (width + adj * 3) +
          " " +
          (height + adj * 3)
      )
      .style("padding", padding)
      .style("margin", margin)
      .classed("svg-content", true)

    // --------------------
    /* https://github.com/d3/d3-dsv */
    // const dataset = d3.csv(
    //   "https://raw.githubusercontent.com/thiskevinwang/you-suck-try-harder/linechart/public/data2.csv"
    // )
    // const dataset2 = Promise.resolve(d3.csvParse(CSV_STRING))
    const dataset = d3.json<T[]>(
      `http://localhost:3000/users/a5f5d36a-6677-41c2-85b8-7578b4d98972/attempts?limit=${limit}&offset=${offset}&start=${start}&end=${end}`
    )

    dataset.then((data) => {
      data.sort((a, b) => a.date - b.date)
      console.log("dataset1::data", data)

      const slices = [
        {
          id: "grade",
          values: data.map(function (d) {
            return {
              date: new Date(d.date),
              measurement: d.grade,
            }
          }),
        },
      ]
      console.log("dataset1::slices", slices)

      //-----------------------------DATA------------------------------//
      // console.log("Column headers", data.columns)
      // returns the sliced dataset
      console.log("Slices", slices)
      // returns the first slice
      console.log("First slice", slices?.[0])
      // returns the array in the first slice
      console.log("A array", slices?.[0]?.values)
      // returns the date of the first row in the first slice
      console.log("Date element", slices?.[0]?.values?.[0]?.date)
      // returns the array's length
      console.log("Array length", slices?.[0]?.values?.length)

      //----------------------------SCALES-----------------------------//
      const xScale = d3.scaleTime().range([0, width]) // Left-to-Right
      const yScale = d3.scaleLinear().rangeRound([height, 0]) // Top-to-Bottom

      /* https://github.com/d3/d3-array/blob/master/README.md#extent */
      const xExtent = d3.extent(data, (d) => {
        return new Date(d.date)
      })
      xScale.domain(xExtent)

      /* https://github.com/d3/d3-array#max */
      const yMax = d3.max(data, (d) => {
        return d.grade + Y_TOLERANCE
      })
      yScale.domain([0, yMax])

      //-----------------------------AXES------------------------------//
      const yaxis = d3
        /* https://github.com/d3/d3-axis/blob/master/README.md#axisLeft */
        .axisLeft(yScale)
        /* https://github.com/d3/d3-axis/blob/master/README.md#axis_ticks */
        .ticks(slices[0].values.length / 2)
        .scale(yScale)

      const xTimeInterval = d3.timeHour.every(4)
      const xaxis = d3
        /* https://github.com/d3/d3-axis/blob/master/README.md#axisBottom */
        .axisBottom(xScale)
        /* https://github.com/d3/d3-axis/blob/master/README.md#axis_ticks */
        .ticks(xTimeInterval)
        /* https://github.com/d3/d3-axis/blob/master/README.md#axis_tickFormat */
        .tickFormat((dt) => {
          switch (new Date(dt as any).getHours()) {
            case 0:
              return d3.timeFormat("%b %d")(dt as Date)
            case 12:
              return d3.timeFormat("%H:%M")(dt as Date)
          }
        })
        // .tickSize(9)
        .tickSizeInner(6)
        .tickSizeOuter(10)
        .scale(xScale)

      //-------------------------2. DRAWING----------------------------//

      // Draw X Axis line
      // Defaults to top
      svg
        .append("g")
        .attr("class", "axis")
        // Position X Axis line at bottom
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis)
        // Rotate tick labels
        .selectAll("text")
        // .style("text-anchor", "end")
        .attr("dx", "1em")
        .attr("dy", "1em")
        .attr("transform", "rotate(45)")
      // .attr("transform", "rotate(60)")

      // Add Y Axis Label: "Seconds"
      svg
        .append("g")
        .attr("class", "axis")
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Seconds")

      // Line
      const line = d3
        .line()
        .x((d: any) => xScale(d.date))
        .y((d: any) => yScale(d.measurement))

      const lines = svg.selectAll("lines").data(slices).enter().append("g")

      lines
        .append("path")
        .attr("fill", "none")
        .attr("stroke-dasharray", 2)
        .attr("stroke", "var(--opposite")
        .attr("opacity", 0.5)
        .attr("d", (d) => line(d.values as any))

      // -------------------Add dots-------------------------
      svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        // Position the dot (coordinate-x, coordinate-y)
        .attr("cx", (d: any) => xScale(new Date(d.date)))
        .attr("cy", (d: any) => yScale(d.grade))
        .attr("r", 1) // Radius
        .style("fill", "var(--opposite")
    })
    return () => {
      d3.select("#container").selectAll("*").remove()
    }
  }, [limit, offset, start, end])
  return (
    <>
      <h1>Time Under Tension</h1>
      <div className="flex flex-col items-start border rounded border-red-500 sm:border-green-500 md:border-blue-500 lg:border-indigo-500 xl:border-pink-500 my-2 p-2">
        <label className="text-white dark:text-green-400" htmlFor="start">
          Start
        </label>
        <input
          id="start"
          type="date"
          value={new Date(start).toISOString().slice(0, 10)}
          min="2019-01-01"
          max="2020-12-31"
          onChange={makeHandleSetTime(setStart)}
        />
      </div>
      <div className="flex flex-col items-start border rounded border-red-500 sm:border-green-500 md:border-blue-500 lg:border-indigo-500 xl:border-pink-500 my-2 p-2">
        <label className="text-white dark:text-red-400" htmlFor="end">
          End
        </label>
        <input
          id="end"
          type="date"
          value={new Date(end).toISOString().slice(0, 10)}
          min="2019-01-01"
          max="2020-12-31"
          onChange={makeHandleSetTime(setEnd)}
        />
      </div>
      <div className="flex flex-col items-start border rounded border-red-500 sm:border-green-500 md:border-blue-500 lg:border-indigo-500 xl:border-pink-500 my-2 p-2">
        <label className="text-white" htmlFor="limit">
          Limit
        </label>
        <input
          name="limit"
          id="limit"
          type="number"
          // value="2018-07-22"
          value={limit}
          min="0"
          max="100"
          onChange={(e) => setLimit(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-start border rounded border-red-500 sm:border-green-500 md:border-blue-500 lg:border-indigo-500 xl:border-pink-500 my-2 p-2">
        <label className="text-white" htmlFor="offset">
          Offset
        </label>
        <input
          name="offset"
          id="offset"
          type="number"
          // value="2018-07-22"
          value={offset}
          min="0"
          max="100"
          onChange={(e) => setOffset(e.target.value)}
        />
      </div>
      <div id="container" className="svg-container"></div>
    </>
  )
}

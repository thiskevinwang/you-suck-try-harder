import { useEffect } from "react"
import * as d3 from "d3"

export const BarChart = () => {
  useEffect(() => {})
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
    const timeConv = d3.timeParse("%d-%b-%Y")
    const dataset = d3.csv(
      "https://raw.githubusercontent.com/thiskevinwang/you-suck-try-harder/linechart/public/data.csv"
    )
    dataset.then(function (data) {
      const slices = data.columns.slice(1).map(function (id) {
        return {
          id: id,
          values: data.map(function (d) {
            return {
              date: timeConv(d.date),
              measurement: +d[id],
            }
          }),
        }
      })

      //-----------------------------DATA------------------------------//
      console.log("Column headers", data.columns)
      console.log("Column headers without date", data.columns.slice(1))
      // returns the sliced dataset
      console.log("Slices", slices)
      // returns the first slice
      console.log("First slice", slices[0])
      // returns the array in the first slice
      console.log("A array", slices[0].values)
      // returns the date of the first row in the first slice
      console.log("Date element", slices[0].values[0].date)
      // returns the array's length
      console.log("Array length", slices[0].values.length)

      //----------------------------SCALES-----------------------------//

      const xScale = d3.scaleTime().range([0, width])
      const yScale = d3.scaleLinear().rangeRound([height, 0])
      xScale.domain(
        d3.extent(data, function (d) {
          return timeConv(d.date)
        })
      )
      yScale.domain([
        0,
        d3.max(slices, function (c) {
          return d3.max(c.values, function (d) {
            return d.measurement + 4
          })
        }),
      ])

      //-----------------------------AXES------------------------------//

      // const yaxis = d3.axisLeft(yScale).scale(yScale)
      // const xaxis = d3.axisBottom(xScale).scale(xScale)
      const yaxis = d3
        .axisLeft(yScale)
        .ticks(slices[0].values.length)
        .scale(yScale)

      const xaxis = d3
        .axisBottom(xScale)
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat("%b %d"))
        .scale(xScale)

      //----------------------------LINES------------------------------//

      //-------------------------2. DRAWING----------------------------//

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis)

      svg.append("g").attr("class", "axis").call(yaxis)

      //-----------------------------AXES------------------------------//

      // --------AXIS LABEL::FREQUENCY
      //this you had
      svg
        .append("g")
        .attr("class", "axis")
        .call(yaxis)
        //this you append
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Seconds")

      //----------------------------LINES------------------------------//
      const line = d3
        .line()
        .x(function (d: any) {
          return xScale(d.date)
        })
        .y(function (d: any) {
          return yScale(d.measurement)
        })

      const lines = svg.selectAll("lines").data(slices).enter().append("g")

      lines
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "var(--opposite")
        .attr("d", function (d: any) {
          return line(d.values)
        })
    })
  }, [])
  return (
    <>
      <h1>Time Under Tension</h1>
      <div id="container" className="svg-container"></div>
    </>
  )
}

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import _ from "lodash"
import styled from "styled-components"
import { animated } from "react-spring"

import { SEO } from "../../components/SEO"

interface Bin {
  value: number
}
type Week = [Bin, Bin, Bin, Bin, Bin, Bin, Bin]
interface Props {
  data?: Week[]
}

const HEIGHT = 10
const MARGIN = 3

const HeatmapContainer = styled(animated.div)`
  display: flex;
  width: 100%;
`
const Svg = styled(animated.svg)`
  padding: 1rem;
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: flex-end;
  /* width: ${_.ceil(365 / 7) * 13}px; */
  width: 100%;
  overflow-x: scroll;
`
const myColor = d3
  .scaleLinear<string, string>()
  .domain([1, 10])
  .range(["#ebedf0", "#196127"])

export default function Heatmap({ data }: Props) {
  const d3Container = useRef(null)

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current)

      const g = svg
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        /** translate X of the columns, based on the week */
        .attr(
          "transform",
          (d: Week, i) => `translate(${i * (HEIGHT + MARGIN)},0)`
        )

      const rect = g
        .selectAll("rect")
        /** past nested data to <rect> children */
        .data((d: Week) => d)
        .enter()
        .append("rect")
        .attr("width", HEIGHT)
        .attr("height", HEIGHT)
        /** offset Y, based on the day */
        .attr("y", (d, i) => {
          return i * (HEIGHT + MARGIN)
        })
        .style("fill", d => myColor(d.value))
    }
  }, [data, d3Container.current])
  // prettier-ignore
  return (
    <>
      <SEO title="Heatmap" />

      <h1>Heatmap</h1>
      <HeatmapContainer>
        <Svg className="d3-component" ref={d3Container} />
      </HeatmapContainer>
    </>
  )
}

Heatmap.getInitialProps = async ({ req }): Promise<{ data: Week[] }> => {
  const data = Array(365)
    .fill(null)
    .map(() => ({ value: Math.floor(Math.random() * 10) }))
  return {
    data: _.chunk(data, 7) as Week[],
  }
}

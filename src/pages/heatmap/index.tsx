import { useRef, useEffect } from "react"
import * as d3 from "d3"
import _ from "lodash"
import styled from "styled-components"
import { animated } from "react-spring"

import { SEO } from "../../components/SEO"

interface Bin {
  value: number
}
interface Props {
  data?: Bin[]
}

const HEIGHT = 10
const Svg = styled(animated.svg)`
  border: 1px dashed grey;
  width: 400px;
  height: 200px;
`

export default function Heatmap({ data }: Props) {
  const d3Container = useRef(null)

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current)
      var myColor = d3
        .scaleLinear<string, string>()
        .domain([1, 10])
        .range(["black", "#69b3a2"])

      // Bind D3 data
      const update = svg
        .append("g")
        .selectAll()
        .data(data)

      // Enter new D3 elements
      update
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (HEIGHT + 1))
        // .attr("y", HEIGHT)
        .attr("width", HEIGHT)
        .attr("height", HEIGHT)
        .attr("margin", 5)
        .style("font-size", 24)
        .style("fill", (d: Bin) => myColor(d.value))
        .text((d: Bin) => d.value)

      // Update existing D3 elements
      update.attr("x", (d, i) => i * HEIGHT).text((d: Bin) => d.value)

      // Remove old D3 elements
      update.exit().remove()
    }
  }, [data, d3Container.current])
  // prettier-ignore
  return (
    <>
      <SEO title="Heatmap" />

      <h1>Heatmap</h1>
      <div style={{ border: `1px dotted grey` }}>
        <Svg className="d3-component" ref={d3Container} />
      </div>
    
      <svg>
        <g transform="translate(0, 0)">
          <rect className="day" width="10" height="10" x="14" y="0" fill="#c6e48b" data-count="6" data-date="2019-01-13" />
          <rect className="day" width="10" height="10" x="14" y="13" fill="#c6e48b" data-count="4" data-date="2019-01-14"/>
          <rect className="day" width="10" height="10" x="14" y="26" fill="#c6e48b" data-count="2" data-date="2019-01-15"/>
          <rect className="day" width="10" height="10" x="14" y="39" fill="#c6e48b" data-count="4" data-date="2019-01-16"/>
          <rect className="day" width="10" height="10" x="14" y="52" fill="#c6e48b" data-count="7" data-date="2019-01-17"/>
          <rect className="day" width="10" height="10" x="14" y="65" fill="#c6e48b" data-count="9" data-date="2019-01-18"/>
          <rect className="day" width="10" height="10" x="14" y="78" fill="#c6e48b" data-count="7" data-date="2019-01-19"/>
        </g>
      </svg>
    </>
  )
}

Heatmap.getInitialProps = async ({ req }): Promise<{ data: Bin[] }> => {
  const data = Array(365)
    .fill("")
    .map(() => ({ value: Math.floor(Math.random() * 10) }))
  return {
    data,
  }
}

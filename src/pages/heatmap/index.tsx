import _ from "lodash"
import ms from "ms"

import { SEO } from "../../components/SEO"
import { Layout } from "../../components/Layout"
import Heatmap, { Week } from "../../components/Heatmap"

export default function HeatmapPage({ data }) {
  return (
    <>
      <SEO title="About" />
      <Layout>
        <Heatmap data={data} />
      </Layout>
    </>
  )
}

HeatmapPage.getInitialProps = async ({ req }): Promise<{ data: Week[] }> => {
  const data = Array(365) // [0...364]
    .fill(null)
    .map((e, i) => {
      const time = new Date().getTime() - ms(`${364 - i} days`)
      const month = new Date(time).getMonth() + 1
      const date = new Date(time).getDate()
      const year = new Date(time).getFullYear()

      return {
        value: Math.floor(Math.random() * 100),
        date: `${month}-${date}-${year}`,
      }
    })
  return {
    data: _.chunk(data, 7) as Week[],
  }
}

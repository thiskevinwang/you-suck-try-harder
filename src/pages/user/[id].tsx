import { useRouter } from "next/router"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"
import _ from "lodash"
import ms from "ms"

import { Layout } from "../../components/Layout"
import Heatmap, { Week } from "../../components/Heatmap"

function fetcher(url: string) {
  return fetch(url).then(r => r.json())
}

interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  created: string
  updated: string
  avatar_url: string
}

export default function UserPage({ heatmapData }) {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR<ApolloQueryResult<{ user: User }>>(
    `/api/user/${id}`,
    fetcher
  )

  if (!data) return "Loading"
  if (data.loading) return "Loading..."
  if (error) return "SWR error"
  if (data.errors) return "Query error"

  const { user } = data.data
  return (
    <Layout>
      <h1>{user.username}</h1>
      <img
        src={user.avatar_url}
        style={{ width: `5rem`, height: `5rem`, borderRadius: `50%` }}
      />
      <p>
        {user.first_name} {user.last_name}
      </p>
      <Heatmap data={heatmapData} />
    </Layout>
  )
}

UserPage.getInitialProps = async ({
  req,
}): Promise<{ heatmapData: Week[] }> => {
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
    heatmapData: _.chunk(data, 7) as Week[],
  }
}

import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"
import _ from "lodash"

import { Layout } from "../../components/Layout"
import Heatmap from "../../components/Heatmap/V2"

async function fetcher(url: string) {
  const r = await fetch(url)
  return await r.json()
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

export default function UserPage({ id }) {
  const { data: uData, error: uError } = useSWR<
    ApolloQueryResult<{ user: User }>
  >(`/api/user/${id}`, fetcher)
  const { data: hData, error: hError } = useSWR(
    () => `/api/heatmap?count=365&userId=`,
    fetcher
  )

  if (!uData) return "User Loading"
  if (uData.loading) return "User Loading..."
  if (uData.errors) return "Query error"
  if (uError) return `User error: ${uError}`

  if (!hData) return "Heatmap Loading"
  if (hData.loading) return "Heatmap Loading..."
  if (hError) return `Heatmap error: ${hError}`

  const { user } = uData.data
  const { heatmapData } = hData
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

UserPage.getInitialProps = async ({ req, query }) => {
  // const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  const { id } = query
  return { id }
}

import { useRouter } from "next/router"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"
import gql from "graphql-tag"
import _ from "lodash"
import ms from "ms"

import { Layout } from "../../components/Layout"
import Heatmap from "../../components/Heatmap/V2"
import { client } from "../../apolloClient"

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

const GET_ALL_SESSIONS = gql`
  query GetAllSessions {
    getAllSessions {
      id
      created
      attempts {
        id
        grade
        send
      }
    }
  }
`
interface Data {
  getAllSessions: {
    // [Session]
    id: string
    created: Date
    attempts: {
      // [Attempt]
      id: string
      grade: string
      send: boolean
    }[]
  }[]
}
UserPage.getInitialProps = async ({ req }) => {
  const masterList = Array(365) // [0...364]
    .fill(null)
    .map((e, i) => {
      const timestamp = new Date(+new Date() - ms(`${364 - i} days`))
      const month = timestamp.getMonth()
      const date = timestamp.getDate()
      const year = timestamp.getFullYear()

      return { date: new Date(year, month, date) }
    })

  try {
    const queryResult = await client.query<Data>({
      query: GET_ALL_SESSIONS,
    })

    const {
      data: { getAllSessions: data },
    } = queryResult

    const indices: any[] = _.flow(
      _.partialRight(_.map, e => {
        const timestamp = new Date(e.created)
        const month = timestamp.getMonth()
        const date = timestamp.getDate()
        const year = timestamp.getFullYear()

        if (e.attempts.length > 0) return +new Date(year, month, date)
      }),
      _.compact
    )(data)

    const heatmapData = _.flow(
      _.partialRight(_.map, e => {
        const index = indices.indexOf(+e.date)
        return {
          date: e.date,
          attempts: index >= -1 ? data[index]?.attempts ?? [] : [],
        }
      }),
      _.partialRight(_.chunk, 7)
    )(masterList)

    return {
      heatmapData: heatmapData,
    }
  } catch (error) {
    console.log(error)
    return
  }
}

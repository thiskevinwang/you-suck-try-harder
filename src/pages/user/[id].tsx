import { useRouter } from "next/router"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"
import gql from "graphql-tag"
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

export default function UserPage() {
  const router = useRouter()
  const { id } = router.query

  const { data: uData, error: uError } = useSWR<
    ApolloQueryResult<{ user: User }>
  >(`/api/user/${id}`, fetcher)
  const { data: hData, error: hError } = useSWR(
    `/api/heatmap?count=365`,
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

/**
 * @deprecated Move heatmap data fetching into useSWR.
 * SSR doesn't need this data, so fetch it clientside.
 */

// const SELECT = 365
// UserPage.getInitialProps = async ({ req }) => {
//   const masterList = Array(SELECT) // [0...364]
//     .fill(null)
//     .map((e, i) => {
//       const timestamp = new Date(
//         new Date().getTime() - ms(`${SELECT - 1 - i} days`)
//       )
//       const month = timestamp.getUTCMonth()
//       const date = timestamp.getUTCDate()
//       const year = timestamp.getUTCFullYear()

//       return { date: new Date(year, month, date) }
//     })

//   try {
//     const queryResult = await client.query<Data>({
//       query: GET_ALL_SESSIONS,
//     })

//     const {
//       data: { getAllSessions: data },
//     } = queryResult

//     /**
//      * @WARN
//      * indices.length must equal data.length
//      * DONOT _.compact out the falsy values.
//      */
//     const indices: any[] = _.flow(
//       _.partialRight(_.map, e => {
//         const timestamp = new Date(e.created)
//         const month = timestamp.getUTCMonth()
//         const date = timestamp.getUTCDate()
//         const year = timestamp.getUTCFullYear()

//         if (e.attempts.length > 0) {
//           return +new Date(year, month, date)
//         }
//       })
//       // _.compact
//     )(data)

//     const heatmapData = _.map(masterList, e => {
//       const index = indices.indexOf(+e.date)
//       return {
//         date: new Date(e.date),
//         attempts: index > -1 ? data[index].attempts : [],
//       }
//     })
//     // console.log(heatmapData)

//     const chunked = _.chunk(heatmapData, 7)
//     return {
//       heatmapData: chunked,
//     }
//   } catch (error) {
//     console.log(error)
//     return
//   }
// }

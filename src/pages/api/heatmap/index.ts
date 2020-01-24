import gql from "graphql-tag"
import { NextApiRequest, NextApiResponse } from "next"
import ms from "ms"
import _ from "lodash"

import { client } from "../../../apolloClient"

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
 * This API route returns `_.chunk(..., 7)`'d data to be passed to a `<Heatmap>(v2)`
 * component.
 *
 * Fetch it with:
 * ```tsx
 * async function fetcher(url: string) {
 *   const r = await fetch(url)
 *   return await r.json()
 * }
 * const { data: hData, error: hError } = useSWR(
 *   `/api/heatmap?count=${count ?? 365}`,
 *   fetcher
 * )
 * ```
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { count } = req.query
  const SELECT = parseInt(Array.isArray(count) ? count[0] : count) ?? 365
  const masterList = Array(SELECT) // [0...364]
    .fill(null)
    .map((e, i) => {
      const timestamp = new Date(
        new Date().getTime() - ms(`${SELECT - 1 - i} days`)
      )
      const month = timestamp.getUTCMonth()
      const date = timestamp.getUTCDate()
      const year = timestamp.getUTCFullYear()

      return { date: new Date(year, month, date) }
    })

  try {
    const queryResult = await client.query<Data>({
      query: GET_ALL_SESSIONS,
    })

    const {
      data: { getAllSessions: data },
    } = queryResult

    /**
     * @WARN
     * indices.length must equal data.length
     * DONOT _.compact out the falsy values.
     */
    const indices: any[] = _.flow(
      _.partialRight(_.map, e => {
        const timestamp = new Date(e.created)
        const month = timestamp.getUTCMonth()
        const date = timestamp.getUTCDate()
        const year = timestamp.getUTCFullYear()

        if (e.attempts.length > 0) {
          return +new Date(year, month, date)
        }
      })
      // _.compact
    )(data)

    const heatmapData = _.map(masterList, e => {
      const index = indices.indexOf(+e.date)
      return {
        date: new Date(e.date),
        attempts: index > -1 ? data[index].attempts : [],
      }
    })

    const chunked = _.chunk(heatmapData, 7)
    res.status(200).json({
      heatmapData: chunked,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

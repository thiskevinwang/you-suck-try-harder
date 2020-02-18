import gql from "graphql-tag"
import { NextApiRequest, NextApiResponse } from "next"
import ms from "ms"
import _ from "lodash"

import { client } from "../../../apolloClient"
import { Attempt } from "components/Heatmap/V2"

const getBaseDay = (input: Date | string | number): number => {
  const timestamp = new Date(input)
  const month = timestamp.getUTCMonth()
  const date = timestamp.getUTCDate()
  const year = timestamp.getUTCFullYear()
  return +new Date(year, month, date)
}

const GET_ATTEMPTS_BY_USER_ID = gql`
  query GetAttemptsByUserId($userId: ID!) {
    getAttemptsByUserId(userId: $userId) {
      date
      id
      grade
      send
      user {
        id
      }
    }
  }
`
interface Data {
  getAttemptsByUserId: Attempt[]
}

const YEAR = 365
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
  const { count, userId } = req.query
  const now = new Date()
  const currentWeekDay = now.getUTCDay()

  const parsedCount = parseInt(Array.isArray(count) ? count[0] : count)

  const select = (parsedCount ?? YEAR) + currentWeekDay

  // The template
  const masterList: { baseDay: number }[] = Array(select) // [0...364]
    .fill(null)
    .map((e, i) => {
      const timestamp = new Date(now.getTime() - ms(`${select - 1 - i} days`))
      return { baseDay: getBaseDay(timestamp) }
    })

  try {
    const queryResult = await client.query<Data>({
      query: GET_ATTEMPTS_BY_USER_ID,
      variables: {
        userId,
      },
    })

    const {
      data: { getAttemptsByUserId: data },
    } = queryResult

    /**
     * create a dictionary of Attempts, key'd by
     * date (baseDay)
     *
     * ```ts
     * const groupedData = {
     *   '1580965200000': [
     *     {
     *       date: '2020-02-06T15:11:03.642Z',
     *       ...otherFields
     *     }
     *   ]
     * }
     * ```
     */
    const attemptsGroupedByBaseDay = _.groupBy(data, attempt =>
      getBaseDay(attempt.date)
    )

    // map through the 365 dates from masterList[]
    // and return objects with attempts from the _.groupBy
    // dictionary, accessed by `baseDay`
    const heatmapData = _.map(masterList, ({ baseDay }, index) => {
      const attempts = attemptsGroupedByBaseDay[baseDay] ?? []
      // if (attempts.length < 1) console.log("empty day", index)
      return {
        date: new Date(baseDay),
        attempts,
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

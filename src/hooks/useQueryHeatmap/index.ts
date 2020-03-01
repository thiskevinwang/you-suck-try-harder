import { gql, useQuery } from "@apollo/client"
import ms from "ms"
import _ from "lodash"
import { Attempt } from "components/Heatmap/V2"

const getBaseDay = (input: Date | string | number): number => {
  const timestamp = new Date(input)
  const month = timestamp.getUTCMonth()
  const date = timestamp.getUTCDate()
  const year = timestamp.getUTCFullYear()
  return +new Date(year, month, date)
}

export const GET_ATTEMPTS_BY_USER_ID = gql`
  query GetAtteamptsByUserId($userId: ID!) {
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

export const useQueryHeatmap = ({ count, userId }) => {
  const now = new Date()
  const currentWeekDay = now.getUTCDay()

  const select = (count ?? YEAR) + currentWeekDay

  // The template
  const masterList: { baseDay: number }[] = Array(select) // [0...364]
    .fill(null)
    .map((e, i) => {
      const timestamp = new Date(now.getTime() - ms(`${select - 1 - i} days`))
      return { baseDay: getBaseDay(timestamp) }
    })

  const { data: queryData, loading } = useQuery<Data>(GET_ATTEMPTS_BY_USER_ID, {
    variables: {
      userId,
    },
  })

  if (loading) return { chunked: null }

  const data = queryData?.getAttemptsByUserId

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
  return { chunked }
}

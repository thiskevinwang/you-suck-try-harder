import { NextPageContext } from "next"
import { useQuery, gql } from "@apollo/client"

import { Layout } from "components/Layout"
import Heatmap from "components/Heatmap/V2"
import { LoadingIndicator } from "components/Loaders"
import { UserDetails } from "components/User/Details"
import { CreateAttempt } from "components/CreateAttempt"

import { useAuthentication } from "hooks/useAuthentication"
import { useQueryHeatmap } from "hooks/useQueryHeatmap"

const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: ID!) {
    user: getUserById(id: $id) {
      id
      username
      first_name
      last_name
      created
      updated
      avatar_url
    }
  }
`
interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  created: string
  updated: string
  avatar_url: string
}

const UserPage = ({ id }) => {
  const { data: uData } = useQuery(GET_USER_BY_ID_QUERY, { variables: { id } })
  const { chunked: heatmapData } = useQueryHeatmap({ userId: id, count: 365 })

  // const { data: uData, error: uError, isValidating: uIsValidating } = useSWR<
  //   ApolloQueryResult<{ user: User }>
  // >(`/api/user/${id}`, fetcher)
  // const {
  //   data: hData,
  //   error: hError,
  //   isValidating: hIsValidating,
  //   revalidate,
  // } = useSWR(() => `/api/heatmap?count=365&userId=${id}`, fetcher)

  const { currentUserId } = useAuthentication()
  const isCurrentUser = id === currentUserId

  return (
    <Layout>
      <UserDetails user={uData?.user}></UserDetails>
      <HeatmapLoadingWrapper data={heatmapData}></HeatmapLoadingWrapper>
      {isCurrentUser && (
        <>
          <h3>Log Attempt(s)</h3>
          <CreateAttempt currentUserId={currentUserId} />
        </>
      )}
    </Layout>
  )
}

UserPage.getInitialProps = async ({ query }: NextPageContext) => {
  // const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  return query
}

const HeatmapLoadingWrapper = ({ data }) => {
  if (!data) return <LoadingIndicator />
  return <Heatmap data={data} />
}

export default UserPage

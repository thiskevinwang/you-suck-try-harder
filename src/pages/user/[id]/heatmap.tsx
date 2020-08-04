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

const UserHeatmapPage = ({ id }) => {
  const { data: uData } = useQuery(GET_USER_BY_ID_QUERY, { variables: { id } })
  const { chunked: heatmapData } = useQueryHeatmap({ userId: id, count: 365 })

  const { currentUserId } = useAuthentication()
  const isCurrentUser = id === currentUserId

  return (
    <Layout>
      <UserDetails user={uData?.user}></UserDetails>
      <h2>Heatmap</h2>
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

UserHeatmapPage.getInitialProps = async ({ query }: NextPageContext) => {
  // const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  return query
}

const HeatmapLoadingWrapper = ({ data }) => {
  if (!data) return <LoadingIndicator />
  return <Heatmap data={data} />
}

export default UserHeatmapPage

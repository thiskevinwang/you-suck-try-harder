import { NextPageContext } from "next"
import { useQuery, gql } from "@apollo/client"

import { Layout } from "components/Layout"
import { LoadingIndicator } from "components/Loaders"
import { UserDetails } from "components/User/Details"
import { BarChart } from "components/BarChart"

import { useAuthentication } from "hooks/useAuthentication"

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

  const { currentUserId } = useAuthentication()
  const isCurrentUser = id === currentUserId

  return (
    <Layout>
      <UserDetails user={uData?.user}></UserDetails>
      <BarChart />
    </Layout>
  )
}

UserPage.getInitialProps = async ({ query }: NextPageContext) => {
  // const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  return query
}

export default UserPage

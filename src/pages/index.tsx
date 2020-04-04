import Link from "next/link"
import { useQuery, gql } from "@apollo/client"

import { SEO } from "components/SEO"
import { Layout } from "components/Layout"
import { UserDetails } from "components/User/Details"
import { UserDetailsLoader } from "components/Loaders/UserDetailsLoader"
import { useAuthentication } from "hooks/useAuthentication"

const UserDetailsLink = ({ id, user, isActive }) => (
  <Link href="/user/[id]" as={`/user/${id}`}>
    <a>
      <UserDetails user={user} isActive={isActive} />
    </a>
  </Link>
)
interface Users {
  users: {
    id: string
    username: string
    avatar_url: string
  }[]
}

const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    users: getAllUsers {
      id
      username
      avatar_url
      first_name
      last_name
    }
  }
`

function Overview() {
  const { data } = useQuery<Users>(GET_ALL_USERS_QUERY)
  const { currentUserId } = useAuthentication()
  return (
    <>
      <SEO title="Overview" />
      <Layout>
        <h1>Overview</h1>
        <ul>
          {data?.users.map((user) => (
            <UserDetailsLink
              id={user.id}
              key={`${user.id}-${user.username}`}
              user={user}
              isActive={user.id === currentUserId}
            />
          )) ?? <UserDetailsLoader />}
        </ul>
      </Layout>
    </>
  )
}

// Home.getInitialProps = async ({ req }) => {
//   const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
//   return { userAgent }
// }

export default Overview

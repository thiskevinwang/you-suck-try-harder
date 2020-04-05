import Link from "next/link"
import { useQuery, gql } from "@apollo/client"
import { useTransition, animated } from "react-spring"

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
interface User {
  id: string
  username: string
  avatar_url: string
}
interface Users {
  users: User[]
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
  const { data: uData } = useQuery<Users>(GET_ALL_USERS_QUERY)
  const { currentUserId } = useAuthentication()

  const transition = useTransition(uData?.users, {
    from: { opacity: 0, transform: "translate3d(-10%,0,0)" },
    enter: (_item) => ({
      opacity: 1,
      transform: "translate3d(0%,0,0)",
    }),
    leave: { opacity: 0, transform: "translate3d(20%,0,0)" },
    trail: 100,
  })
  return (
    <>
      <SEO title="Overview" />
      <Layout>
        <h1>Overview</h1>
        <ul>
          {uData ? (
            transition((props, user) => (
              <animated.div style={props}>
                <UserDetailsLink
                  id={user.id}
                  key={`${user.id}-${user.username}`}
                  user={user}
                  isActive={user.id === currentUserId}
                />
              </animated.div>
            ))
          ) : (
            <UserDetailsLoader />
          )}
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

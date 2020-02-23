import Link from "next/link"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"

import { SEO } from "components/SEO"
import { Layout } from "components/Layout"
import { UserDetails } from "components/User/Details"
import { UserDetailsLoader } from "components/Loaders/UserDetailsLoader"

import { useAuthentication } from "hooks/useAuthentication"

function fetcher(url: string) {
  return fetch(url).then(r => r.json())
}

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

function Overview() {
  const { data, error } = useSWR<ApolloQueryResult<Users>>(
    `/api/users`,
    fetcher
  )
  const { currentUserId } = useAuthentication()
  console.log("---", typeof data?.data?.users?.[0]?.id, typeof currentUserId)
  return (
    <>
      <SEO title="Overview" />
      <Layout>
        <h1>Overview</h1>
        <ul>
          {data?.data?.users.map(user => (
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

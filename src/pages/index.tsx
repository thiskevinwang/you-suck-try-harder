import Link from "next/link"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"
import styled from "styled-components"

import { SEO } from "../components/SEO"
import { Layout } from "../components/Layout"

import { UserDetailsLoader } from "components/Loaders/UserDetailsLoader"

function fetcher(url: string) {
  return fetch(url).then(r => r.json())
}

const StyledUserDetails = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;

  display: flex;
  align-items: center;
  img {
    margin-left: 1rem;
    margin-right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  div > h3 {
    min-height: 1rem;
    min-width: 8rem;
    margin: 0px 0px 1pt;
  }
  div > p {
    min-height: 1rem;
    min-width: 5rem;
    margin: 0px;
  }
`
const UserDetailsLink = ({ id, user }) => (
  <Link href="/user/[id]" as={`/user/${id}`}>
    <a>
      <StyledUserDetails>
        <img src={user.avatar_url} />
        <div>
          <h3>{user.username}</h3>
          <p>
            {user.first_name} {user.last_name}
          </p>
        </div>
      </StyledUserDetails>
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

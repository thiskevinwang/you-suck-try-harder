import Link from "next/link"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"
import styled from "styled-components"

import { SEO } from "../components/SEO"
import { Layout } from "../components/Layout"

function fetcher(url: string) {
  return fetch(url).then(r => r.json())
}

const Img = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${Img} {
    margin-right: 1rem;
  }
`
const UserLink = ({ id, user }) => (
  <Row>
    <Img src={user.avatar_url} />

    <Link href="/user/[id]" as={`/user/${id}`}>
      <a>User: {id}</a>
    </Link>
  </Row>
)
interface Users {
  users: {
    id: string
    username: string
    avatar_url: string
  }[]
}

function Home() {
  const { data, error } = useSWR<ApolloQueryResult<Users>>(
    `/api/users`,
    fetcher
  )
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <h1>Home</h1>
        <ul>
          {data?.data?.users.map(user => (
            <UserLink
              id={user.id}
              key={`${user.id}-${user.username}`}
              user={user}
            />
          ))}
        </ul>
      </Layout>
    </>
  )
}

// Home.getInitialProps = async ({ req }) => {
//   const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
//   return { userAgent }
// }

export default Home

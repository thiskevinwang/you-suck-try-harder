import { NextPageContext } from "next"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"
import _ from "lodash"
import styled from "styled-components"

import { Layout } from "../../components/Layout"
import Heatmap from "../../components/Heatmap/V2"
import { LoadingIndicator } from "components/Loaders"
import { UserDetailsLoader } from "components/Loaders/UserDetailsLoader"

async function fetcher(url: string) {
  const r = await fetch(url)
  return await r.json()
}

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
  const { data: uData, error: uError } = useSWR<
    ApolloQueryResult<{ user: User }>
  >(`/api/user/${id}`, fetcher)
  const { data: hData, error: hError } = useSWR(
    () => `/api/heatmap?count=365&userId=${id}`,
    fetcher
  )

  if (!uData)
    return (
      <Layout>
        <UserDetailsLoader />
      </Layout>
    )
  // if (uData.loading) return <Layout>"User Loading..."</Layout>
  // if (uData.errors) return <Layout>"Query error"</Layout>
  // if (uError) return <Layout>{`User error: ${uError}`}</Layout>

  if (!hData)
    return (
      <Layout>
        <LoadingIndicator />
      </Layout>
    )
  // if (hData.loading) return <Layout>"Heatmap Loading..."</Layout>
  // if (hError) return <Layout>{`Heatmap error: ${hError}`}</Layout>

  if (!id) return <Layout>"router loading"</Layout>
  const user = uData?.data?.user
  const heatmapData = hData?.heatmapData
  return (
    <Layout>
      <UserDetails>
        <img src={user?.avatar_url} />

        <div>
          <h3>{user?.username}</h3>
          <p>
            {user?.first_name} {user?.last_name}
          </p>
        </div>
      </UserDetails>
      <Heatmap data={heatmapData} />
    </Layout>
  )
}

UserPage.getInitialProps = async ({ query }: NextPageContext) => {
  // const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  return query
}

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-left: 1rem;
    margin-right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  div > h3,
  div > p {
    margin: 0px !important;
  }
`

export default UserPage

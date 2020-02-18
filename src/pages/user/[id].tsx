import { NextPageContext } from "next"
import useSWR from "swr"
import { ApolloQueryResult } from "apollo-client"

import { Layout } from "components/Layout"
import Heatmap from "components/Heatmap/V2"
import { LoadingIndicator } from "components/Loaders"
import { UserDetails } from "components/User/Details"

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
  const { data: uData, error: uError, isValidating: uIsValidating } = useSWR<
    ApolloQueryResult<{ user: User }>
  >(`/api/user/${id}`, fetcher)
  const { data: hData, error: hError, isValidating: hIsValidating } = useSWR(
    () => `/api/heatmap?count=365&userId=${id}`,
    fetcher
  )

  // if (!uData) return <Layout></Layout>
  // if (uData.loading) return <Layout>"User Loading..."</Layout>
  // if (uData.errors) return <Layout>"Query error"</Layout>
  // if (uError) return <Layout>{`User error: ${uError}`}</Layout>

  // if (!hData)
  //   return (
  //     <Layout>

  //     </Layout>
  //   )
  // if (hData.loading) return <Layout>"Heatmap Loading..."</Layout>
  // if (hError) return <Layout>{`Heatmap error: ${hError}`}</Layout>

  // if (!id) return <Layout>"router loading"</Layout>
  // const user = uData?.data?.user
  // const heatmapData = hData?.heatmapData
  return (
    <Layout>
      <UserDetails user={uData?.data?.user}></UserDetails>
      <HeatmapLoadingWrapper data={hData?.heatmapData}></HeatmapLoadingWrapper>
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

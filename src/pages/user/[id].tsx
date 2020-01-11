import { useRouter } from "next/router"
import useSWR from "swr"

import { Layout } from "../../components/Layout"

function fetcher(url: string) {
  return fetch(url).then(r => r.json())
}

export default function Post() {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(`/api/user/${id}`, fetcher)

  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  )
}

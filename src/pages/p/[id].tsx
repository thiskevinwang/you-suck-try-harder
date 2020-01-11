import { useRouter } from "next/router"
import { Layout } from "../../components/Layout"

export default function Post() {
  const router = useRouter()
  console.log(router.query)

  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <p>This is the blog post content.</p>
    </Layout>
  )
}

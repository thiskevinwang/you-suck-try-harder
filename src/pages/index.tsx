import { SEO } from "../components/SEO"
import { Layout } from "../components/Layout"
import Link from "next/link"

const PostLink = props => (
  <li>
    <Link href="/p/[id]" as={`/p/${props.id}`}>
      <a>{props.id}</a>
    </Link>
  </li>
)

function Home() {
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <h1>Home</h1>
        <ul>
          <PostLink id="hello-nextjs" />
          <PostLink id="learn-nextjs" />
          <PostLink id="deploy-nextjs" />
        </ul>
      </Layout>
    </>
  )
}

export default Home

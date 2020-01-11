import Link from "next/link"
import { SEO } from "../components/SEO"
import { Layout } from "../components/Layout"

function Home() {
  return (
    <>
      <SEO title="Home" />
      <Layout>
        <h1>Home</h1>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About Us</a>
            </Link>
          </li>
        </ul>
      </Layout>
    </>
  )
}

export default Home

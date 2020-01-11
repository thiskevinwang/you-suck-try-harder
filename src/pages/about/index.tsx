import Link from "next/link"
import { SEO } from "../../components/SEO"
import { Layout } from "../../components/Layout"

function About() {
  return (
    <>
      <SEO title="About" />
      <Layout>
        <h1>About</h1>
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

export default About

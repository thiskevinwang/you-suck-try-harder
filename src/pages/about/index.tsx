import { SEO } from "components/SEO"
import { Layout } from "components/Layout"

function About() {
  return (
    <>
      <SEO title="About" />
      <Layout>
        <h1>The title says it all</h1>
        <h2>Find me</h2>
        <p>
          I attempt to&nbsp;
          <a target="_blank" rel="noopener" href="https://coffeecodeclimb.com">
            blog about stuff
          </a>
          &nbsp;(mostly learning code)
        </p>
        <p>
          I try to fit into the&nbsp;
          <a
            target="_blank"
            rel="noopener"
            href="https://twitter.com/thekevinwang"
          >
            developer world
          </a>
        </p>
        <p>
          I take&nbsp;
          <a
            target="_blank"
            rel="noopener"
            href="https://instagram.com/thekevinwang"
          >
            pics of random things
          </a>
        </p>
      </Layout>
    </>
  )
}

export default About

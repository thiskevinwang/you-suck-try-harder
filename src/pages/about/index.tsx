import { SEO } from "components/SEO"
import { Layout } from "components/Layout"

function About() {
  return (
    <>
      <SEO title="About" />
      <Layout>
        <h1>About</h1>

        <h2>
          <i>"You Suck, Try Harder"</i>
        </h2>
        <p>
          Often times I've found myself at the my climbing gym, basically just
          waisting time, not climbing, but fooling myself into thinking I
          actually was climbing. This is a fun project to help shed some light
          on how much climbing I'm actually doing.
        </p>

        <h2>Developer Stuff</h2>
        <p>
          This is built with 'next', 'styled-components', 'react-spring',
          'apollo', 'typescript', and talks to a detached graphql apollo server.
        </p>

        <h2>Find me</h2>
        <p>
          I attempt to blog about stuff (mostly about my self-taught programming
          life) at <a href="https://coffeecodeclimb.com">Coffee Code Climb</a>.
        </p>
        <p>
          I'm also on <a href="https://twitter.com/thekevinwang">Twitter</a>.
        </p>
      </Layout>
    </>
  )
}

export default About

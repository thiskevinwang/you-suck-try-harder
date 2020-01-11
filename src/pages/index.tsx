import Link from "next/link"
import useSWR from "swr"

import { SEO } from "../components/SEO"
import { Layout } from "../components/Layout"

function fetcher(url) {
  return fetch(url).then(r => r.json())
}

const PostLink = props => (
  <li>
    <Link href="/p/[id]" as={`/p/${props.id}`}>
      <a>{props.id}</a>
    </Link>
  </li>
)

function Home({ userAgent }) {
  console.log({ userAgent })
  const { data, error } = useSWR("/api/randomQuote", fetcher)

  const author = data?.author
  let quote = data?.quote
  if (!data) quote = "Loading..."
  if (error) quote = "Failed to fetch the quote."

  return (
    <>
      <SEO title="Home" />
      <Layout>
        <h1>Home</h1>
        <div>Quote of the day</div>
        <i>{quote}</i>&nbsp;
        {author && <span className="author">- {author}</span>}
        <ul>
          <PostLink id="hello-nextjs" />
          <PostLink id="learn-nextjs" />
          <PostLink id="deploy-nextjs" />
        </ul>
      </Layout>
    </>
  )
}

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  return { userAgent }
}

export default Home

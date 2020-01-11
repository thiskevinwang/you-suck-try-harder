import Link from "next/link"

function About() {
  return (
    <>
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
    </>
  )
}

export default About

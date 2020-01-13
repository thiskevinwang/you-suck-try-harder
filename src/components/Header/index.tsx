import Link from "next/link"

export const Header = () => {
  return (
    <div>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
    </div>
  )
}

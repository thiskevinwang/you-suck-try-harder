import Link from "next/link"

import { ThemeSlider } from "../ThemeSlider"

export const Header = () => {
  return (
    <div>
      <ThemeSlider />
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
      <li>
        <Link href="/heatmap">
          <a>Heatmap</a>
        </Link>
      </li>
    </div>
  )
}

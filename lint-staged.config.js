/**
 * Issue with lint-staged not detecting files with square brackets in the name
 *
 * Issue
 * @see https://github.com/okonet/lint-staged/issues/676#issuecomment-553598068
 *
 * File
 * @see https://github.com/zeit/next.js/blob/canary/lint-staged.config.js
 */

const escape = require("shell-quote").quote
const isWin = process.platform === "win32"

module.exports = {
  "**/*.{js,jsx,ts,tsx}": filenames => {
    const escapedFileNames = filenames
      .map(filename => `"${isWin ? filename : escape([filename])}"`)
      .join(" ")
    return [
      `prettier --with-node-modules --ignore-path='./.prettierignore_staged' --write ${escapedFileNames}`,
      // `eslint --no-ignore --max-warnings=0 --fix ${filenames
      //   .map(f => `"${f}"`)
      //   .join(" ")}`,
      `git add ${escapedFileNames}`,
    ]
  },
  "**/*.{json,md,mdx,css,html,yml,yaml,scss}": filenames => {
    const escapedFileNames = filenames
      .map(filename => `"${isWin ? filename : escape([filename])}"`)
      .join(" ")
    return [
      `prettier --with-node-modules --ignore-path='./.prettierignore_staged' --write ${escapedFileNames}`,
      `git add ${escapedFileNames}`,
    ]
  },
}

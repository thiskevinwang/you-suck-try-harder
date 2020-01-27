require("dotenv").config()
const path = require("path")

module.exports = {
  webpack(config, options) {
    config.resolve.alias["src"] = path.join(__dirname, "src")
    config.resolve.alias["components"] = path.join(__dirname, "src/components")
    config.resolve.alias["consts"] = path.join(__dirname, "src/consts")
    config.resolve.alias["state"] = path.join(__dirname, "src/state")
    config.resolve.alias["apolloClient"] = path.join(
      __dirname,
      "src/apolloClient.ts"
    )
    return config
  },
  env: {
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    DB_NAME: process.env.DB_NAME,
    COLLECTION_NAME: process.env.COLLECTION_NAME,
  },
}

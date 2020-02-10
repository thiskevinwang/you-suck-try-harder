# you-suck-try-harder

## Fun discoveries

### `react-spring` & SSR

`react-spring@9.0.0-beta.34`

- This version resulted in incorrect `useSpring` values when viewing the production build (`yarn build && yarn start`)
  - see [thread](https://github.com/react-spring/react-spring/issues/804#issuecomment-565296240)

`react-spring@9.0.0-canary.808.14.192785c` - ✅ Fixes
`react-spring@9.0.0-canary.808.15.d4e5904` - ❌ API changes, and breaks build process.
`react-spring@9.0.0-canary.808.16.68edca3` - ❌ ...
`react-spring@9.0.0-canary.808.17.55c5691` - ❌ [🔗](https://github.com/react-spring/react-spring/compare/3bbb8712f51c7b61d07687196a6c05c230262386...9b9a4c87b8ccfa8aefc5a0a03c3b2eb001612372)

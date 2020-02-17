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

### Network Tab Explained

https://developers.google.com/web/tools/chrome-devtools/network/reference#timing-explanation

### "would clobber existing tag" warning

If you get the following output log when trying to _Synchronize Changes_ via VSCode,

```bash
From github.com:thiskevinwang/you-suck-try-harder
 * branch            layout-stuff   -> FETCH_HEAD
 ! [rejected]        v0.0.0-alpha.3 -> v0.0.0-alpha.3  (would clobber existing tag)
```

... run `git fetch --tags -f` and it should work again.

- https://github.com/concourse/git-resource/issues/233

### Inspiration

Used https://github.com/codebushi/gatsby-theme-document/tree/master/gatsby-theme-document/src/components for inspiration when I got stuck and didn't know how to layout my site.

- The leftsidebar code taught me alot

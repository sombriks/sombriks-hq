---
layout: blog-layout.pug
date: 2023-03-15
tags:
  - posts
  - jsx
  - react
  - production build
  - react-router
  - dotenv-flow
  - react-testing-library
  - github pages
---

# Make Create React App and React Router behave when building for production

Hello, when building [react](https://reactjs.org) projects wih [CRA](https://create-react-app.dev/),
everything that a modern frontend development has to offer is present: support
for a development server, modules hot reload,
[tooling support](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
and a [testing library](https://testing-library.com/docs/react-testing-library/intro/).

There is, however, a few important steps to perform in order to go from
development mode to production.

In this article we'll point out a few issues when using
[github pages](https://pages.github.com/) as a hosting solution for the app.

## Building and publishing

Publishing a static site at github pages is cool because it's mostly
[GitOps](https://www.gitops.tech/): commit is publish, and github pages now
use github actions workflows to deploy your site:

![github-pages-config.png](/post-pics/0044-cra-builds-for-non-root-urls/github-pages-config.png)

The default deploy action, however, tries to deploy the root directory of your
project; back in time, it was the default method to deploy something using
github pages, but now there are actions. Use this customized action to properly
deploy your CRA application:

{% raw %}

```yaml
# .github/workflows/gh-page-deploy.yml
# best approach to use this configuration is to go first into 
# github pages project settings, select github action to publish
# and then replace the offered action by this one.
name: build and deploy gh-pages

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}

        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build --if-present

      - name: Setup Pages
        uses: actions/configure-pages@v3

      # make sure to point to the build folder produced by previous build step
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: './build'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

{% endraw %}

And that's it, every push to the main branch will run the action and will
publish the app.

However...

## I got a blank page

It happens because CRA builds to be in the root directory of you site.

Github pages, by default, are not.

To fix that, CRA documentation suggest to
[add the homepage attribute into your package.json](https://create-react-app.dev/docs/deployment/#step-1-add-homepage-to-packagejson) file.

And this is a good enough solution.

Unless...

## My react router dom is behaving funny

If you project uses [react router](https://reactrouter.com/en/main/start/overview),
History push navigation most likely will replace the uri part which is your
project from the site url.

CRA build itself went well, but router dom isn't aware of that homepage
configuration.

To resolve that, you can set the [basename](https://reactrouter.com/en/main/router-components/router)
attribute on your route.

But then...

## Now it works in production (gh-pages) but it's not working locally

Since locally, in development mode, you do run at root site context, `basename`
will mess with your developer experience. What a ride, huh?

## A better solution

A little dig and a better solution pop out.

CRA has good support for [dotenv-flow](https://create-react-app.dev/docs/adding-custom-environment-variables#what-other-env-files-can-be-used)
[configurations](https://create-react-app.dev/docs/advanced-configuration)
out of the box.

Make use of `.env.development` and `.env.production` env files and set these two
variables:

```bash
# .env.development
PUBLIC_URL=/
REACT_APP_URI=/
```

```bash
# .env.production
PUBLIC_URL=https://sombriks.github.io/react-studies/
# to make react router behave
REACT_APP_URI=/react-studies
```

And edit your router to point to the specified uri:

```jsx
// some imports 
function App() {
    return (
        <Router basename={process.env.REACT_APP_URI}>
          // the rest of tye component
```

But it happens...

No, just kidding, this time you're good to develop and to deploy.

## Conclusion

This small tweak is one of those things you do and forget, so it's nice to keep
it recorded somewhere, just in case you need it in the future.

You can find the source code sampling this solution
[here](https://github.com/sombriks/react-studies).

Happy hacking.

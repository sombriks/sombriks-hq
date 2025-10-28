---
layout: blog.pug
tags: 
  - posts
  - react
  - vue
  - css tookits
date: 2019-02-09
---
# Good enough UI on reactive framework era

As [promised](#/0007-vue-and-react-side-by-side.md) before here comes another
comparative article to advise you about vue and react ecosystem regarding CSS
toolkits. This is quite opinionated so buckle up and keep your critic sense
online.

## So what's the big deal about CSS toolkits

The web is built by HTML, CSS and Javascript maybe consuming some remote service
written in PHP and sometimes, by accident, any other language.

And _The Real World(TM)_ has something called deadlines.

In order to keep projects and dream on schedule, every work must be optimized
and the sweet reinvention of the wheel shall be avoided.

One way to do that is to use the nice work that other people cared enough to
share with the world.

And scripts and styles to make beautiful user interfaces are good to reuse
because this is what your customer will touch first.

You may need of course to study how to correctly use such jewels, but often it
worths the challenge. Mostly.

## Who are the big ones in this ecosystem

[Well](https://stackshare.io/stackups/bootstrap-vs-material-design-vs-semantic-ui),
there is [Bootstrap](https://getbootstrap.com/),
[Material Design](https://material.io/design/) [and](https://bulma.io/)
[then](https://nostalgic-css.github.io/NES.css/)
[some](https://foundation.zurb.com/sites/docs/index.html)
[others](https://semantic-ui.com/), but in this post we'll dive into Material
Design world.

## How many material frameworks are there

This is a tricky question since every day a new javascript framework is born.
But a simple search delivers the following results:

### Vue

- [vue-material](https://vuematerial.io/)
- [vuetify](https://vuetifyjs.com/)
- [muse-ui](https://muse-ui.org)

Other results omitted, just not worthy

### React

- [material-ui](https://material-ui.com/)
- [mui](https://www.muicss.com/docs/v1/react/introduction)
- [react-mdl](https://tleunen.github.io/react-mdl/)

Other results omitted, either bootstrap or someone trying to sell support

## Let's see some action, but first

First let's define what we need to produce so we can be fair.

There is [this study project](https://github.com/sombriks/rosetta-beer-store)
where it's possible to combine different back ends and front ends.

Regardless what is the front or back, it has a quite well defined contract to be
fulfilled so this is exactly what we need to make the comparation as fair as
possible.

We'll run the clients against the
[beer-store-service-express-knex](https://github.com/sombriks/rosetta-beer-store/tree/master/beer-store-service-express-knex)
because `npm install` and `npm run dev` are by far the easiest options to put a
back end online.

### Vue version

It uses **vue-material** as it's material design implementation and things in
`package.json` couldn't be more honest:

```json
{
  "name": "beer-store-client-browserify-vuejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "budo src/main.js:build.js -o -l -H 127.0.0.1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.17.1",
    "material-design-icons-iconfont": "^3.0.3",
    "vue": "^2.5.9",
    "vue-material": "^0.8.1",
    "vue-router": "^3.0.1"
  },
  "devDependencies": {
    "browserify": "^14.5.0",
    "browserify-css": "^0.14.0",
    "budo": "^10.0.4",
    "vueify": "^9.4.1"
  },
  "browserify": {
    "transform": ["browserify-css", "vueify"]
  }
}
```

While webpack has the reasonable zero-conf nowadays, browserify did that in 2014
and no one made it a big event. Also, in this setup we can clearly see that vue
is completely possible without babel. Less is more, biggest sophistication is
simplicity, on my most productive day i threw away a thousand lines of code, you
got the idea.

Beer listing is this:

```html
<template>
  <div>
    <topbar>
      <h1 slot="left">Beer Listing</h1>
    </topbar>
    <md-layout md-gutter md-column>
      <searchbar @onsearch="dosearch" :resultlist="beerlist"></searchbar>
      <beer-item v-for="beer in beerlist" :key="beer.idbeer" :beer="beer">
        <md-button
          slot="heading-options"
          class="md-icon-button"
          @click="$router.push(`/beer-details/${beer.idbeer}`)"
        >
          <md-icon>visibility</md-icon>
        </md-button>
      </beer-item>
    </md-layout>
  </div>
</template>

<script>
const { beerservice } = require("../components/restapi");
module.exports = {
  name: "BeerListing",
  data: _ => ({
    page: 1,
    beerlist: []
  }),
  created() {
    this.dosearch();
  },
  methods: {
    async dosearch(s) {
      const ret = await beerservice.list(s);
      this.beerlist = ret.data;
    }
  }
};
</script>
```

We use the `created` life cycle hook to call our rest api and onc it returns we
set the beerlist inside data section, which represents the component state, then
vue and it's reactivity does the magic of dispatch a redraw.

You can see topbar, searchbar and beer-item components
[there](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-browserify-vuejs/src/components/shell/topbar.vue),
[there](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-browserify-vuejs/src/components/shell/searchbar.vue)
and
[there](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-browserify-vuejs/src/components/beer/beer-item.vue).

### React Version

Oh boy.

React version uses **material-ui** as it's material design implementation and
the proper configuration expands into three files:

#### package.json

```json
{
  "name": "beer-store-client-webpack-reactjs",
  "version": "1.0.0",
  "description": "sample client to showcase what react can do",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --open"
  },
  "keywords": [],
  "author": "sombriks@gmail.com",
  "license": "ISC",
  "dependencies": {
    "@material-ui/core": "^3.9.1",
    "@material-ui/icons": "^3.0.2",
    "axios": "^0.18.0",
    "react": "^16.7.0",
    "react-dom": "^16.7.0",
    "react-router": "^4.3.1",
    "react-router-dom": "^4.3.1"
  },
  "devDependencies": {
    "@babel/core": "^7.2.2",
    "@babel/plugin-proposal-class-properties": "^7.3.0",
    "@babel/preset-env": "^7.3.1",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.5",
    "clean-webpack-plugin": "^1.0.1",
    "css-loader": "^2.1.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.29.0",
    "webpack-cli": "^3.2.1",
    "webpack-dev-server": "^3.1.14"
  }
}
```

#### webpack.config.js

```js
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  entry: "./src/main.jsx",
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist")
  },
  devtool:
    process.env.NODE_ENV == "development" ? "inline-source-map" : undefined,
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

#### .babelrc

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

Unlike vue version, babel setup isn't optional, its **mandatory**. The dev
server must be properly configured to load a template instead of detect it, but
on the plus side it does [HMR](https://webpack.js.org/concepts/hot-module-replacement/)
instead of reloading, which sometimes is preferable action over page reload.

This is beer listing on react:

```javascript
import React from "react";

import {beerservice} from "../api";

import {TopBar} from "../components/top-bar";
import {SearchBar} from "../components/search-bar";
import {BeerItem} from "../components/beer-item";

import List from '@material-ui/core/List';
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";

export class BeerListing extends React.Component {
  // @babel/plugin-proposal-class-properties
  state = {params: {search: "", page: 1, pageSize: 10}, list: []};

  componentDidMount() {
    this.busca();
  }

  busca = params => {
    if (params) {
      this.state.params = params;
      this.setState(this.state);
    }
    beerservice.list(this.state.params).then(ret => {
      this.state.list = ret.data;
      this.setState(this.state);
    });
  };

  render() {
    const {params, list} = this.state;
    return (
      <div>
        <TopBar left={"Beer Listing"} />
        <SearchBar params={params} list={list} busca={this.busca} />
        <List>
          {list.map(beer => (
            <BeerItem beer={beer} key={beer.idbeer}>
              <IconButton href={`#/beer-details/${beer.idbeer}`}>
                <VisibilityIcon/>
              </IconButton>
            </BeerItem>
          ))}
        </List>
      </div>
    );
  }
}
```

We use the `componentDidMount` lifecycle method (not to mistake with
[hooks](https://reactjs.org/docs/hooks-intro.html)) to call the rest api and
once it calls the [setState](https://reactjs.org/docs/react-component.html#setstate)
and only then a redraw is invoked by react.

You can see the TopBar component [here](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-webpack-react/src/components/top-bar.jsx)

But let's talk about the `SearchBar` component a little:

```javascript
import React from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";

import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing.unit,
    width:"100%"
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class SearchBar_ extends React.Component {
  state = {params: {search: "", page: 1, pageSize: 10}};

  handleChange = ev => {
    this.state.params.search = ev.target.value;
    this.state.params.page = 1;
    this.setState(this.state);
    this.props.busca(this.state.params);
  };

  handlePrev = _ => {
    this.state.params.page--;
    this.setState(this.state);
    this.props.busca(this.state.params);
  };

  handleNext = _ => {
    this.state.params.page++;
    this.setState(this.state);
    this.props.busca(this.state.params);
  };

  render() {
    const {params} = this.state;
    const {list, classes} = this.props;
    return (
      <Grid container spacing={24}>
        <Grid item xs={8}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="component-simple">Search</InputLabel>
            <Input id="component-simple" value={params.search} onChange={this.handleChange} />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={params.page == 1}
            onClick={this.handlePrev}
          >
            Prev
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={list.length < params.pageSize}
            onClick={this.handleNext}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export const SearchBar = withStyles(styles)(SearchBar_);
```

One exotic and important thing about material-ui is the opinionated way it
applies css on it's components.

It goes **CSS-IN-JS** all way down.

I don't like this approach at all, since it makes good web designers which are
well versed in css, scss and others quite obsolete due a questionable evolution.

And BeerItem you can see [here](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-webpack-react/src/components/beer-item.jsx).

## Conclusion

While we could continue to rewrite the same thing on various distinct idioms,
the results would vary little from what we have here.
[Newest vue](https://medium.com/the-vue-point/vue-2-6-released-66aa6c8e785e)
(did you saw that?! also, zero backward breaking changes! Again!) keeps way more
friendly to newcomers and to the ones who already know standard web development
while react ecosystem is huge yet hermetic, closed over itself.

If your major concern is to build a fresh team, go with vue. Nowadays you should
choose react only if there is a team already well versed on int.

Finally, feel free to explore the [source code](https://github.com/sombriks/rosetta-beer-store)
of the repository used as foundation to this post.

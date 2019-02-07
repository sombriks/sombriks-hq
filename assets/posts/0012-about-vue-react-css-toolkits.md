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

Other results omitted, either bootstrap or trying to sell support

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

You can see topbar, searchbar and beer-item components 
[there](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-browserify-vuejs/src/components/shell/topbar.vue),
[there](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-browserify-vuejs/src/components/shell/searchbar.vue)
and
[there](https://github.com/sombriks/rosetta-beer-store/blob/master/beer-store-client-browserify-vuejs/src/components/beer/beer-item.vue).

### React Version

Oh boy.

2019-02-06

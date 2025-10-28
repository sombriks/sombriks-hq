---
layout: blog-base.webc
tags: 
  - posts
  - vue
  - react
  - redux
  - pinia
date: 2022-05-07
---
# Another very opinionated comparison

[Back in time](/blog/#0007-vue-and-react-side-by-side.md) i did a similar comparison
but boy time flies.

But this time let's focus on the global source of truth solution.

## About global state / source of truth

Programmers born in the internet age passed years listening about the bad things
that can happen when using global variables. Your requests could end up mixing,
several race conditions could cripple your web page on heavy loads situations.

Bud modern web isn't a dumb terminal anymore (computers tend to have that tide
which sends important processing from mainframe/server to terminal/application
time to time) and the current client state become complex and expensive to
maintain using the old ways that a browser where meant to do.

Therefore we have that mix of smart servers and smart clients, and the client
information needs more efficient ways to share information across all their
smart components.

## Why global state is a thing

This one is easy to answer.

Take this scenario for instance:

![sample-screen](/assets/post-pics/0031-redux-vs-pinia/products.jpg)

I want a certain set of behaviors here:

1. Login/logoff resets the filter and paginator.
1. Filter changes resets the paginator.
1. Each named element is a distinct component.

That said, how to solve it without using a global source of truth?

Well, [it's pretty ugly](https://github.com/sombriks/redux-vs-pinia/blob/main/vue-without-pinia/src/App.vue).

The components become very coupled to each other:

```html
<ProductPaginator
    :page="page"
    :products="products"
    :pageSize="pageSize"
    @onPage="doPage"
  />
```

Even in this simple example we can observe the complexity that the lack of a
centralized store can bring.

## How pinia works

Let's do it again using Pinia this time:

```html
<template>
  <NavBar/>
  <ProductListing/>
  <ProductPaginator/>
</template>

<script setup>
import NavBar from "./components/NavBar.vue" 
import ProductListing from "./components/ProductListing.vue"
import ProductPaginator from "./components/ProductPaginator.vue"
</script>

<style></style>
```

That's it.

Components are simply declared and know how to solve their states and events
without bother the root component.

In pinia, all you have to do is to define your [stores](https://github.com/sombriks/redux-vs-pinia/blob/main/vue-with-pinia/src/store/index.js#L47),
inside them the state, some getters and your actions:

```js
export const useProducts = defineStore('products', {
  state() {
    return {
      list: [..._products.slice(0, 5)],
    }
  },
  actions: {
    queryProducts(query, page) {
      const filter = useFilter();
      let products = _products;
      if (query != "") products = products.filter((p) => p.name.includes(query));
      if (!page || page <= 0) page = 1;
      this.list = products.slice((page - 1) * filter.pageSize, filter.pageSize * page);
      filter.setPage(page)
      filter.setQuery(query)
    }
  }
})
```

Actions can change the state "directly", unlike
what we need to do in redux in order to keep it working properly.

This is how the NavBar consumes a pinia store:

{% raw %}

```html
<template>
  <div>
    <input v-model="query" @keyup="filterStore.updateQuery(query)" />
    <button @click="userStore.setLogged(!userStore.logged)">
      {{ loginOut }}
    </button>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useUser, useFilter } from "../store";
const userStore = useUser();
const filterStore = useFilter();
const loginOut = ref("Login");
watchEffect(() => {
  loginOut.value = userStore.logged ? "Logout" : "Login"
})
const query = ref(filterStore.query);
</script>

<style></style>
```

{% endraw %}

## How redux works

The root component or react will benefit from a centralized state as well:

```jsx
import NavBar from "./components/NavBar";
import ProductListing from "./components/ProductListing";
import ProductPaginator from "./components/ProductPaginator";

export default function App() {
  return (
    <div>
     <NavBar/>
     <ProductListing/>
     <ProductPaginator/>
    </div>
  );
}
```

Things start to get funny when we do the action/reducer/dispatch boilerplate
needed by redux.

You need to declare [actions](https://github.com/sombriks/redux-vs-pinia/blob/main/react-with-redux/src/store/index.js#L38):

```js
export const filterActions = {
  setPage(page) {
    return { type: SET_PAGE, payload: page }
  },
  setQuery(query) {
    return { type: SET_QUERY, payload: query }
  },
}
```

Then a reducer to consume them:

```js
const filterReducer = (state = { query: "", page: 1 }, action) => {
  switch (action.type) {
    case SET_PAGE:
      return { ...state, page: action.payload }
    case SET_QUERY:
      return { ...state, query: action.payload }
    default:
      return state
  }
}
```

Export all reducers into a centralized state:

```js
// creating store with combined reducers

export const store = createStore(
  combineReducers({ userReducer, filterReducer, productsReducer })
)
```

And you will be able to consume redux pretty much like this:

```jsx
import { useSelector, useDispatch } from 'react-redux'

import { productActions, filterActions, userActions } from '../store'

export default function NavBar(props) {
  const userState = useSelector(state => state.userReducer)
  const filter = useSelector(state => state.filterReducer)
  const dispatch = useDispatch()

  const queryProducts = (e) => {
    dispatch(productActions.queryProducts(e.target.value))
    dispatch(filterActions.setQuery(e.target.value))
    dispatch(filterActions.setPage(1))
  }

  return <div>
    <input value={filter.query} onChange={queryProducts} />
    <button onClick={() => dispatch(userActions.setLogged(!userState.logged))}>
      {userState.logged ? 'Logout' : 'Login'}
    </button>
  </div>
}
```

Yes, you may have noticed that we have more calls to redux store when compared
with pinia store.

## Conclusion

This small sample aims to compare those technologies and give a reasonable start
point to someone planning the adopt one of those technologies.

Things keep evolving and in the future we can analyze future versions of redux.

For the moment, if you're going to a new project and you have some decision
power, give vue3/pinia a chance. It worth it.

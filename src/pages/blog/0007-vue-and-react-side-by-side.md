# Vue and React Side By Side

Ok,
[this](https://medium.com/javascript-in-plain-english/i-created-the-exact-same-app-in-react-and-vue-here-are-the-differences-e9a1ae8077fd) [one](https://medium.com/fundbox-engineering/react-vs-vue-vs-angular-163f1ae7be56)
is pretty documented already, but why not to throw more coal in the fire?

In this post we'll do, step by step, things that everyone expects to face when
coding a modern reactive application.

Also, some alternative trails might be presented too
(for example how to create an app), and some does not exists in one or another
framework context.

## 1 - creating a project

There are many ways to elaborate a project. Essentially you make a folder and
stuff it with artifact solutions.

```bash
mkdir my-project-1
cd my-project-1
```

## 1.1 - The CDN way

```bash
touch index.html
```

The base `index.html` looks like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>FOO</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### 1.1.1 The react way

```html
<!DOCTYPE html>
<html>
  <head>
    <title>FOO</title>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript">
      const Hello = props => {
        const sayhello = _ => alert(`Hello ${props.name}!`);

        return React.createElement(
          "button",
          { onClick: sayhello },
          "Say Hello"
        );
      };
      ReactDOM.render(
        React.createElement(Hello, { name: "World!" }),
        document.getElementById("app")
      );
    </script>
  </body>
</html>
```

### 1.1.2 The vue way

```html
<!DOCTYPE html>
<html>
  <head>
    <title>FOO</title>
    <script src="https://unpkg.com/vue@2.5/dist/vue.js"></script>
  </head>
  <body>
    <div id="app"><button @click="sayhello">Say hello</button></div>
    <script type="text/javascript">
      new Vue({
        el: "#app",
        data: _ => ({ name: "World!" }),
        methods: {
          sayhello() {
            alert(`Hello, ${this.name}`);
          }
        }
      });
    </script>
  </body>
</html>
```

It's a bit unfair with react, since vue can take advantage of existing html
inside the [app mount point](https://vuejs.org/v2/api/#el).

Also, we're missing all the
[jsx](https://reactjs.org/docs/introducing-jsx.html) thing. This is what makes
react ugly or sexy, depending on who's telling it.

## 1.2 The bare bones bundler / fast prototype way

Let's raise the bar a little.

Since we're creating a project, create a folder on a new terminal:

```bash
mkdir my-project-2
cd my-project-2
npm init -y
npm install budo --save-dev
```

So, [budo](https://github.com/mattdesl/budo) is a development server. And it's
fast. **Very fast**. Because it uses [browserify](http://browserify.org/).

Also, unlike the CDN folder, this one is a full featured npm project. Here we
can (and we will) use the [npm registry](https://www.npmjs.com/) to build
amazing things.

This time we will make it more interesting. We will add the jsx support.
Also we'll add vue-loader capabilities. First on react side:

### 1.2.1 The react way

```bash
# inside my-project-2 folder
npm install @babel/core @babel/preset-env @babel/preset-react --save-dev
npm install babelify --save-dev
npm install react react-dom --save
touch main.jsx
```

Now we need to edit the
[package.json](https://docs.npmjs.com/files/package.json) file:

```json
{
  "name": "my-react-project-2",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "budo main.jsx -o -l"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.2.2",
    "@babel/preset-env": "^7.2.3",
    "@babel/preset-react": "^7.0.0",
    "babelify": "^10.0.0",
    "budo": "^11.5.0"
  },
  "dependencies": {
    "react": "^16.7.0",
    "react-dom": "^16.7.0"
  },
  "browserify": {
    "transform": [
      [
        "babelify",
        {
          "presets": ["@babel/preset-env", "@babel/preset-react"]
        }
      ]
    ]
  }
}
```

An then we can write our react with jsx:

```jsx
// main.jsx
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  rev(ev) {
    this.setState({
      name: ev.target.value
    });
  }

  render() {
    return (
      <div>
        My name is&nbsp;
        <input value={this.state.name} onChange={this.rev.bind(this)} />
        &nbsp;and in reverse it is&nbsp;
        {this.state.name
          .split("")
          .reverse()
          .join("")}
      </div>
    );
  }
}

const app = document.createElement("div");
document.body.appendChild(app);
ReactDOM.render(<App />, app);
```

As you can see, jsx is basically a mix of markup with javascript.

Also, the `ReactDOM.render(<App/>, app)` thing is a quite improvement.

If you want to run this snippet, do this on your project folder:

```bash
$ npm run dev
#...
> budo main.jsx -o -l

[0004] info  Server running at http://192.168.0.184:9966/ (connect)
[0004] info  LiveReload running
[0010] 6ms           0B GET    200 / (generated)
[0011] 6748ms     2.4MB (browserify)
[0011] 1273ms        0B GET    200 /main.jsx (generated)
```

The browser will pop up automagically for you.

### 1.2.2 The vue way

Install the vue tools:

```bash
npm install vue --save
npm install vueify --save
touch main.js App.vue
```

Then modify the package.json:

```json
{
  "name": "my-vue-project-2",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "budo main.js -o -l"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "budo": "^11.5.0",
    "vueify": "^9.4.1"
  },
  "dependencies": {
    "vue": "^2.5.21"
  },
  "browserify": {
    "transform": ["vueify"]
  }
}
```

Unlike react version, we'll divide the bootstrap and the component definition
in two artifacts. First, App.vue:

```html
<template>
  <div>
    My name is <input v-model="name" /> and in reverse it is
    {{ eman }}
  </div>
</template>
<script>
  module.exports = {
    name: "app",
    data: _ => ({ name: "" })
    computed: {
      eman: _ => this.name.split("").reverse().join("")
    }
  };
</script>
```

Now main.js:

```javascript
const Vue = require("vue");
const app = document.getElementById("div");
document.body.appendChild(app);
new Vue({ el: app, render: r => r(require("./app.vue")) });
```

To run this:

```bash
$ npm run dev
# ...
> budo main.js -o -l

[0000] info  Server running at http://192.168.0.184:9966/ (connect)
[0000] info  LiveReload running
[0001] 5ms           0B GET    200 / (generated)
[0001] 1117ms     609KB (browserify)
[0001] 637ms         0B GET    200 /main.js (generated)
```

Important things to consider so far:

- react depends on [babel](https://babeljs.io/) to really shine
- vue scales down better
- with budo, the index.html is optional
- embed browserify configurations on package.json helps to keep the project
  folder clean.
- what was the `onChange={this.rev.bind(this)}` thing?
- on vue solution, since we don't have babel, we use `require` instead the
  `import/from` style.

## 1.3 - The CLI tools way

As i spoke
[previously](https://sombriks.com.br/#/blog/0006-browserify-rocks.md),
the bundler role is quite clear today and the new frontier are the tools to
help configuring new projects easier.

This is no news on [angular](https://cli.angular.io/) or
[angularjs](http://ngcli.github.io/) world, but unlike vue or react, the
angular cli is the only way to be really productive.

### 1.3.1 the create-react-app tool

[react cli](https://github.com/facebook/create-react-app) can be installed
pretty easily with npm:

```bash
sudo npm -g i create-react-app
```

Then create your project (it even make the folder so you don't have to):

```bash
$ create-react-app my-react-project-3

Creating a new React app in /Users/sombriks/git/vue-react-comparison/my-react-project-3.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts...


> fsevents@1.2.4 install /Users/sombriks/git/vue-react-comparison/my-react-project-3/node_modules/fsevents
> node install

[fsevents] Success: "/Users/sombriks/git/vue-react-comparison/my-react-project-3/node_modules/fsevents/lib/binding/Release/node-v57-darwin-x64/fse.node" already installed
Pass --update-binary to reinstall or --build-from-source to recompile
+ react@16.7.0
+ react-dom@16.7.0
+ react-scripts@2.1.2
added 1794 packages from 684 contributors and audited 35709 packages in 317.203s
found 0 vulnerabilities


Success! Created my-react-project-3 at /Users/sombriks/git/vue-react-comparison/my-react-project-3
Inside that directory, you can run several commands:

  npm start
    Starts the development server.

  npm run build
    Bundles the app into static files for production.

  npm test
    Starts the test runner.

  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd my-react-project-3
  npm start

Happy hacking!
```

It gives you a pretty decent starter project.

Now let's add [routing](https://reacttraining.com/react-router/) and a
[store](https://redux.js.org/introduction/installation):

```bash
cd my-react-project-3
npm install react-router --save
npm install react-router-dom --save
npm install redux --save
npm install react-redux --save
```

Our project structure will be this:

```bash
my-react-project-3/
├── README.md
├── package-lock.json
├── package.json
├── node_modules/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src/
    ├── App.css
    ├── App.jsx
    ├── App.test.js
    ├── components/
    │   └── Menu.jsx
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reducer.js
    ├── serviceWorker.js
    └── views/
        ├── About.jsx
        ├── Home.jsx
        └── Settings.jsx
```

Inside **src/views** folder some components to serve as views to the routes.
We have 3 views: home, settings and about.

Inside **src/components** those reusable parts. In our example, just the menu.

The router configuration is pretty straightforward, everything got solved
inside `App.jsx`:

```jsx
// src/App.jsx
import React, { Component } from "react";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Menu from "./components/Menu.jsx";
import Home from "./views/Home.jsx";
import About from "./views/About.jsx";
import Settings from "./views/Settings.jsx";

import { Provider } from "react-redux";
import store from "./reducer";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Menu />
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Route path="/home" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
```

You have to define a [Router](https://reacttraining.com/react-router/core/api/Router)
and it must have [Route](https://reacttraining.com/react-router/core/api/Route)
entries inside it. There is also Switch and Redirect, but the docs are good.
Give it a try.

Next we need to configure the redux thing in order to have a global state flux.

Still at App.jsx, there is that [Provider](https://react-redux.js.org/introduction/quick-start#provider)
component keeping the entire app inside it. The [store](https://redux.js.org/api/store)
itself is a property to be passed to it.

The store itself is pretty simple, as you can see at `reducer.js`:

```javascript
import { createStore } from "redux";

const settings = (state = { settings: { name: "Stranger" } }, action) => {
  if (action.type === "setName") return { settings: { name: action.name } };
  return state;
};

const store = createStore(settings);

export default store;
```

The only important thing about states is to never try to change it directly.
This is why that action thing returns a new state.

Set up the store and provider however isn't enough. Lets take a look in
`Menu.jsx` component:

```jsx
import React, { Component } from "react";

import { Link } from "react-router-dom";

import { connect } from "react-redux";

class Menu extends Component {
  render() {
    return (
      <div>
        <h2>Hello, {this.props.settings.name}</h2> |
        <Link to={"/home"}>Home</Link> |<Link to={"/about"}>About</Link> |
        <Link to={"/settings"}>Settings</Link>
      </div>
    );
  }
}

const mapState = state => ({ settings: state.settings });

export default connect(mapState)(Menu);
```

The menu depends on redux state to know a name, so we must make the state
available to the component. This is where
[mapState/connect](https://react-redux.js.org/api/connect) enters.

It works.

Additionally, if you want to change the store state and see it changing
everywhere of course there is a way too. Let's take a look at `Settings.jsx`:

```jsx
import React, { Component } from "react";

import { connect } from "react-redux";

class Settings extends Component {
  state = { name: this.props.settings.name };

  render() {
    return (
      <div>
        <h1>Settings</h1>
        <p>This is Settings page</p>
        My name is
        <input
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })}
        />
        <button onClick={e => this.props.changeName(this.state.name)}>
          Change
        </button>
      </div>
    );
  }
}

const mapState = state => ({ settings: state.settings });
const mapDispatch = dispatch => {
  return {
    changeName: name => dispatch({ type: "setName", name })
  };
};

export default connect(
  mapState,
  mapDispatch
)(Settings);
```

We have in that component a local state and we initialize it with some value
from the store.

The [dispatch](https://react-redux.js.org/using-react-redux/connect-mapdispatch)
callback is available to the functions that will be passed to the component.

### 1.3.2 the @vue/cli tool

[vue cli](https://cli.vuejs.org/) can be installed pretty easily with npm:

```bash
sudo npm -g i @vue/cli
```

Next step is to use the command `vue create my-vue-project-3`. It will enter
into a interactive mode. Answer _Manually select features_ to this one:

```bash
Vue CLI v3.2.1
? Please pick a preset:
  vue (vue-router, babel, eslint)
  sample1 (vue-router, vuex, babel, eslint)
  sample2 (vue-router, babel)
  default (babel, eslint)
❯ Manually select features
```

In this step add `Router` and `Vuex` options:

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project:
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
❯◉ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

In this step just leave everything as is:

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)
```

In this step go with Prettier, but it's just a matter of taste:

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a linter / formatter config:
  ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
❯ ESLint + Prettier
```

Keep _lint on save_ in this step:

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a linter / formatter config: Prettier
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ Lint on save
 ◯ Lint and fix on commit
```

Answer `package.json` on this one:

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a linter / formatter config: Prettier
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)Lint on save
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.?
  In dedicated config files
❯ In package.json
```

Just hit enter on this step (or save your template):

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a linter / formatter config: Prettier
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)Lint on save
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In package.json
? Save this as a preset for future projects? (y/N)
```

And wait the installation finish:

```bash
Vue CLI v3.2.1
✨  Creating project in /Users/sombriks/git/vue-react-comparison/my-vue-project-3.
⚙  Installing CLI plugins. This might take a while...


> fsevents@1.2.4 install /Users/sombriks/git/vue-react-comparison/my-vue-project-3/node_modules/fsevents
> node install

[fsevents] Success: "/Users/sombriks/git/vue-react-comparison/my-vue-project-3/node_modules/fsevents/lib/binding/Release/node-v57-darwin-x64/fse.node" already installed
Pass --update-binary to reinstall or --build-from-source to recompile

> yorkie@2.0.0 install /Users/sombriks/git/vue-react-comparison/my-vue-project-3/node_modules/yorkie
> node bin/install.js

setting up Git hooks
can't find .git directory, skipping Git hooks installation
added 1176 packages from 761 contributors and audited 14865 packages in 185.671s
found 0 vulnerabilities

🚀  Invoking generators...
📦  Installing additional dependencies...

added 35 packages from 28 contributors, updated 2 packages, moved 5 packages and audited 15164 packages in 25.197s
found 0 vulnerabilities

⚓  Running completion hooks...

📄  Generating README.md...

🎉  Successfully created project my-vue-project-3.
👉  Get started with the following commands:

 $ cd my-vue-project-3
 $ npm run serve
```

Since we already have selected router and vue, we don't have to worry
about them.

Our project structure will be this:

```bash
my-vue-project-3/
├── README.md
├── babel.config.js
├── node_modules/
├── package-lock.json
├── package.json
├── public/
│   ├── favicon.ico
│   └── index.html
└── src/
    ├── App.vue
    ├── assets/
    │   └── logo.png
    ├── components/
    │   └── Menu.vue
    ├── main.js
    ├── router.js
    ├── store.js
    └── views/
        ├── About.vue
        ├── Home.vue
        └── Settings.vue
```

Inside **src/views** folder some components to serve as views to the routes.
We have 3 views: home, settings and about.

Inside **src/components** those reusable parts. In our example, just the menu.

The router configuration is pretty straightforward, everything got solved
inside `router.js`:

```javascript
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Settings from "./views/Settings.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", component: Home },
    { path: "/about", component: About },
    { path: "/settings", component: Settings }
  ]
});
```

Those routes will be mounted in the component containing the `<router-view/>`
component, the `App.vue`:

```html
<template>
  <div>
    <my-menu/>
    <router-view/>
  </div>
</template>
<script>
import Menu from "./components/Menu.vue"
export default {
  name:"app",
  components:{
    "my-menu":Menu
  }
}
</script>
```

We can see the menu, registered locally.

The store creation lies inside `store.js`:

```javascript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    settings: { name: "Stranger" }
  },
  mutations: {
    setName: (state, name) => (state.settings.name = name)
  }
});
```

Both router and store are registered in the root viewmodel, inside `main.js`:

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
```

And this is how we consume the data inside the store from any component:

```html
<template>
  <div>
    <h2>Hello, {{settings.name}}</h2>
    <router-link to="/home">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/settings">Settings</router-link> |
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name:"my-menu",
  computed:mapState(["settings"])
}
</script>
```

Similar to redux at react example, there is a mapState, but there is no need of
connect.

In `Settings.vue` we can see how to change the state:

```html
<template>
  <div>
    <h1>Settings</h1>
    <p>This is a Settings page</p>My name is
    <input v-model="name">
    <button @click="changeName">Change</button>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "settings",
  computed: mapState(["settings"]),
  data: _ => ({ name: "" }),
  created() {
    this.name = this.settings.name;
  },
  methods: {
    changeName() {
      this.$store.commit("setName", this.name);
    }
  }
};
</script>
```

In order to properly set initial local state, the
[created()](https://vuejs.org/v2/api/#created) lifecycle hook is employed.

## 2 - Conclusion. Wait, what

It's late and i am tired.

However we could talk on another article about css/widgets frameworks
available to each framework.

And about mobile development on another.

The complete source code can be found [there](https://github.com/sombriks/vue-react-comparison).

2018-12-30

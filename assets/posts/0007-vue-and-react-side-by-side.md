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
    My name is
    <input v-model="name">
    and in reverse it is {{name.split("").reverse().join("")}}
  </div>
</template>
<script>
module.exports = {
  name: "app",
  data: _ => ({ name: "" })
};
</script>

```

Now main.js:

```javascript
const Vue = require("vue")
const app = document.getElementById("div")
document.body.appendChild(app)
new Vue({el:app, render: r => r(require("./app.vue"))})
```

Spot any different setting?

2018-12-29

---
layout: base.webc
tags: 
  - posts
  - vuejs
  - cordova
  - project setup
date: 2018-12-17
---
# Vue.js into a Cordova project

You see, [cordova](https://cordova.apache.org/blog/) has been a reliable tool
for the last years, almost half a decade. [Vue.js](https://vuejs.org/) delivers
solutions quite fast thanks to its simplicity and powerful tools (like
[vue devtools](https://github.com/vuejs/vue-devtools)) available to it.

Both has a cool cli tool to make things easier and well-defined steps for each
stage in the development process.

The project layout they create, however, is quite incompatible.

To generate a new cordova project, all you need to do is:

```bash
sudo npm -g install cordova
# a few npm messages later...
cordova create MyApp com.foo.bar.myapp myapp
# first argument after create will be app name, second pacakge identifier, thrird the folder
```

It will result into something like this:

```bash
myapp
├── config.xml
├── hooks
├── package.json
├── platforms
├── plugins
├── res
└── www
    ├── css
    │   └── index.css
    ├── img
    │   └── logo.png
    ├── index.html
    └── js
        └── index.js
```

Based on this folder, the regular cordova commands (cordova plugin add, cordova
platform add, cordova build, etc) will work properly.

However, the **www** folder, isn't tailored for modern bundle-centered
front-end development. This is why cool things built on top of cordova,
[like the ionic framework](https://ionicframework.com/) grew strong and fast.

Vue on the other hand is progressive and scales up and down. It can be as
simple as cdn library placed inside some html document. It can be huge and
industrial, the Megaman with all the missing armor parts. Yet still swift and
simple, focused on deliver solution instead of puzzle the developer with
cabalistic basic configurations.

The vue-cli tool is at its third major release and can be installed using
(surprise!) npm:

```bash
sudo npm -g install @vue/cli
```

Then you can call the following command to generate a project:

```bash
vue create myotherapp
```

The first prompt will look like this:

```bash
Vue CLI v3.2.1
? Please pick a preset: (Use arrow keys)
  vue (vue-router, babel, eslint)
  default (babel, eslint)
❯ Manually select features
```

The options bellow are a very good start for a vue project:

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project:
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◯ CSS Pre-processors
❯◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

Just say no for the history mode (there is a reason, I'll tell you later!):

```bash
Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n) n
```

You can choose ESLint + Prettier next:

```bash

Vue CLI v3.2.1
? Please pick a preset: Manually select features
? Check the features needed for your project: Babel, Router, Vuex, Linter
? Use history mode for router? (Requires proper server setup for index fallback in production) No
? Pick a linter / formatter config:
  ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
❯ ESLint + Prettier
```

A few more options to answer and you will end up with a project which looks
like this:

```bash
myotherapp
├── README.md
├── babel.config.js
├── node_modules
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
└── src
    ├── App.vue
    ├── assets
    │   └── logo.png
    ├── components
    │   └── HelloWorld.vue
    ├── main.js
    ├── router.js
    ├── store.js
    └── views
        ├── About.vue
        └── Home.vue
```

Noteworthy to say that the **node_modules** folder is _huge_. And if you type
**npm run serve**, it will instruct you on how to open your browser and start
coding.

Now, back to our analysis.

On the cordova app, the _web_ part lies inside the _www_ folder.
And all we have there is and index.html and a js/index.js: no hot-reload,
no modules, preprocessors... nothing.

So, how do we use the best of the two projects?

## Project content merging

Note that both projects are based on folders and configuration which, if you
observe with care, can cohesist.

**Step one:** move, the **src, public, babel.config.js package.json** and
**README.md** to the myapp folder. Make sure to **overwrite the package.json**.

**Step two:** copy www/index.html headers into the public/index.html headers.

This is an interesting step because the way cordova works, the
[content security policy](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CSP)
must be properly configured. Since the default cordova index.html have it, it's
easier to copy the headers instead of create a new one.

The headers looks like this:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;"
/>
<meta name="format-detection" content="telephone=no" />
<meta name="msapplication-tap-highlight" content="no" />
<meta
  name="viewport"
  content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width"
/>
```

**Step three:** copy cordova.js script tag in the bottom of www/index.html to
the bottom of public/index.html

You see, this script does not exists yet. it's built when the cordova application
gets constructed.

The current index.html inside the public folder should look like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;"
    />
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta
      name="viewport"
      content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width"
    />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title>myapp</title>
  </head>
  <body>
    <noscript>
      <strong
        >We're sorry but myotherapp doesn't work properly without JavaScript
        enabled. Please enable it to continue.</strong
      >
    </noscript>
    <div id="app"></div>
    <script type="text/javascript" src="cordova.js"></script>
    <!-- built files will be auto injected -->
  </body>
</html>
```

**Step four:** make sure that your cordova code only starts the engines when
the "deviceready" event gets fired.

To resolve this one you change the src/main.js this way:

```javascript
// src/main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

const appinit = _ =>
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");

if (window.cordova) document.addEventListener("deviceready", appinit);
else appinit();
```

**Step five:** Change the default output folder for _npm run build_ command.

This step resolves a simple yet powerful detail: when you build your vue app,
the final output is the dist directory. Since we want it for our cordova setup,
this folder must overwrite the www folder.

We could do this by hand all the time, but the vue build system has a simpler
alternative.

Add a file called vue.config.js in the project root containing this:

```javascript
// vue.config.js
module.exports = {
  outputDir: "www",
  baseUrl: "./"
};
```

And that's it.

simply type _npm install_ again to reinstall the dependencies, type
_npm run serve_ to rock your boat and point your navigator to
[http://localhost:8080](http://localhost:8080)

the final project layout will look like this:

```bash
myapp
├── README.md
├── babel.config.js
├── config.xml
├── hooks
│   └── README.md
├── node_modules
├── package-lock.json
├── package.json
├── platforms
├── plugins
├── public
│   ├── favicon.ico
│   └── index.html
├── res
│   ├── README.md
│   ├── icon
│   │   ├── android
│   │   ├── bada
│   │   ├── bada-wac
│   │   ├── blackberry
│   │   ├── blackberry10
│   │   ├── ios
│   │   ├── tizen
│   │   ├── webos
│   │   └── windows-phone
│   └── screen
│       ├── android
│       ├── bada
│       ├── bada-wac
│       ├── blackberry
│       ├── blackberry10
│       ├── ios
│       ├── tizen
│       ├── webos
│       └── windows-phone
├── src
│   ├── App.vue
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   ├── main.js
│   ├── router.js
│   ├── store.js
│   └── views
│       ├── About.vue
│       └── Home.vue
├── vue.config.js
└── www
    ├── css
    │   └── app.7dae01f4.css
    ├── favicon.ico
    ├── img
    │   └── logo.82b9c7a5.png
    ├── index.html
    └── js
        ├── about.e9a0cf3b.js
        ├── about.e9a0cf3b.js.map
        ├── app.3529586b.js
        ├── app.3529586b.js.map
        ├── chunk-vendors.3877369c.js
        └── chunk-vendors.3877369c.js.map
```

Bonus: if you face issues with the hot module replacement and didn't figured it
out yet, change the line containing the content security police:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self' ws: wss: http://*:8080 data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;"
/>
```

Since HMR needs local and socket access, you will have to allow such sources.

You can see the source code [here](https://github.com/sombriks/sample-cordova-vue).

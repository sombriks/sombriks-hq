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
mkdir my-project
cd my-project
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

Now if we add react on it:

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

If we add vue:

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
        name: "hello",
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



2018-12-29
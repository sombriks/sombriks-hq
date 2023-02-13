---
layout: base.webc
tags: posts
date: 2022-09-24
---
# ES6 modules on backend

## UPDATE for modern node 

Simply add `"type": "module"` into your package.json file in your node version
[if your node isn't too old](https://nodejs.org/docs/latest-v12.x/api/esm.html#).

---

This is a really quick yet nice one regarding backend.

## TL;DR

Bootstrap a brand new and ordinary node/npm project

```bash
# requires npm 6.x at least
npm init esm -y
```

By issuing `npm init esm -y` two template files will be created too.

The app es6 bootstrap:

```javascript
// index.js

// Set options as a parameter, environment variable, or rc file.
require = require("esm")(module/*, options*/)
module.exports = require("./main.js")
```

And the es6-enabled entry, where you can do things like this:

```javascript
// main.js

import express from "express"

export const app = express()

// ...
```

Look, no babel!

## The not that long story

Back in time Node adopted [CommonsJS](https://en.wikipedia.org/wiki/CommonJS)
module strategy and everyone was happy.

But then client side javascript got that boom in evolution, got bundlers, const,
promises, and also a
[module proposal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

There is when problems begin, because thanks to bundlers like
[browserify](http://browserify.org) frontend people already was happy writing
`require/exports` everywhere.

But of course people made meetings, talked each other and made an agreement and
node itself will handle both styles of module management. Soon or later.

By the day of this writing, you can already use native `import/export` on your
node backend as explained [here](https://nodejs.org/api/esm.html#esm_enabling).

### A sample pre-existing codebase

Let's say that you already have an app more or less like
[this one](https://github.com/sombriks/sample-node-esm/tree/6ca54cc6927b79ac5e6354a06b9cef1ae8ea8009).

There are plenty of use of modules:

```bash
$ tree sample-node-esm
sample-node-esm/
├── README.md
├── app
│   ├── config
│   │   └── database.js
│   ├── main.js
│   └── routes
│       ├── customer.js
│       ├── item.js
│       └── order.js
├── index.js
├── knexfile.js
├── migrations
│   ├── 20190316031748_initial_schema.js
│   ├── 20190316032623_initial_data.js
│   └── 20190316033759_sample_orders.js
├── package-lock.json
├── package.json
└── test
    └── test-suite.js

```

The file named `index.js` is the entry point:

```javascript
// index.js
require("./app/main.js").start();
```

And of course `main.js` exports a bootstrap function called **start**:

```javascript
const { knex } = require("./config/database");
const express = require("express");
const { json } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
exports.app = app;

app.use(morgan("dev"));
app.use(json());
app.use(cors());

app.get("/status", req => req.res.send("ONLINE"));

app.use("/customer", require("./routes/customer").router);
app.use("/item", require("./routes/item").router);
app.use("/order", require("./routes/order").router);

// istanbul ignore next
exports.start = _ => {
  console.log("updating migrations...");
  knex.migrate.latest().then(_ => {
    console.log("done!");
    app.listen(3000, _ => {
      console.log("server online!");
    });
  });
};

```

The test suite does requires too:

```javascript
// test/test-suite.js
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const { app } = require("../app/main");
const { knex } = require("../app/config/database");

describe("sample test suite", _ => {
  const req = chai.request(app).keepOpen();

  before(done => {
    console.log("preparing test db...");
    knex.migrate.latest().then(_ => {
      console.log("done!");
      done()
    });
  });

  after(done => {
    console.log("closing request");
    req.close();
    console.log("cleaning up testing db...");
    knex.migrate.rollback().then(_ => {
      console.log("done!");
      done()
    });
  });

  it("should say hello", done => {
    console.log("Hello!");
    done();
  });

  it("should list customers", done => {
    req.get("/customer/list").end((err, ret) => {
      ret.body.should.be.an("array");
      done(err);
    });
  });

  it("should list items", done => {
    req.get("/item/list").end((err, ret) => {
      ret.body.should.be.an("array");
      done(err);
    });
  });

  it("should list orders", done => {
    req.get("/order/list").end((err, ret) => {
      ret.body.should.be.an("array");
      done(err);
    });
  });
});

```

And the entire working directory is the project root.

### Why modules

You see, split source code in various folders and files helps on reuse,
organization, semantics and debugging too.

Virtually every language has a way to create and use modules. And execution point. Working directory. You got the idea.

### The transformation to es6 modules

First of all, install **esm**:

```bash
npm i esm --save
```

Now we must change our entry point. Edit `index.js`:

```javascript
// index.js
require = require("esm")(module)
module.exports = require("./app/main.js")
module.exports.start()
```

We still can invoke the start function here, Even though we still using the
require/exports style.

Let's change our `main.js`

```javascript
import { knex } from "./config/database";
import express from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";

export const app = express();

app.use(morgan("dev"));
app.use(json());
app.use(cors());

app.get("/status", req => req.res.send("ONLINE"));

import { router as customer } from "./routes/customer";
import { router as item } from "./routes/item";
import { router as order } from "./routes/order";

app.use("/customer", customer);
app.use("/item", item);
app.use("/order", order);

// istanbul ignore next
export const start = _ => {
  console.log("updating migrations...");
  knex.migrate.latest().then(_ => {
    console.log("done!");
    app.listen(3000, _ => {
      console.log("server online!");
    });
  });
};

```

As you can see, there is one major difference between import and require. Both
are statically analyzed when node builds the module dependency tree, but require
have some inline uses. import does not do that.

On the other hand, [tree-shaking](https://webpack.js.org/guides/tree-shaking/)
is easier with import. They say.

### What about the test suite

Since te test suite uses another entry point ([mocha](https://mochajs.org)),
the way we call it changes.

On `package.json`, change the "test" command line in the scripts section:

```json
"scripts": {
  "dev": "nodemon index.js",
  "test": "NODE_ENV=staging nyc mocha -r esm --timeout 10000 --exit"
},
```

And finally let's change the requires on `test-suite.js` too:

```javascript
// test/test-suite.js
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
chai.should();

import { app } from "../app/main";
import { knex } from "../app/config/database";

describe("sample test suite", _ => {
  const req = chai.request(app).keepOpen();

  before(done => {
    console.log("preparing test db...");
    knex.migrate.latest().then(_ => {
      console.log("done!");
      done();
    });
  });

  after(done => {
    console.log("closing request");
    req.close();
    console.log("cleaning up testing db...");
    knex.migrate.rollback().then(_ => {
      console.log("done!");
      done();
    });
  });

  it("should say hello", done => {
    console.log("Hello!");
    done();
  });

  it("should list customers", done => {
    req.get("/customer/list").end((err, ret) => {
      ret.body.should.be.an("array");
      done(err);
    });
  });

  it("should list items", done => {
    req.get("/item/list").end((err, ret) => {
      ret.body.should.be.an("array");
      done(err);
    });
  });

  it("should list orders", done => {
    req.get("/order/list").end((err, ret) => {
      ret.body.should.be.an("array");
      done(err);
    });
  });
});

```

Neat.

## Conclusion

The esm package helps a lot to make the gap between front-end and back-end
javascript. It may be a luxury, something we can live without, but even ide
support gets better, since those es6 modules are the future.

To achieve it without relying on [babel](https://babeljs.io) is pretty
satisfying not because babel is a bad thing, but because soon those modules will
be first class citizens on both sides of this game.

The final project with the modifications seen there can be found
[here on github](https://github.com/sombriks/sample-node-esm).

2019-03-16

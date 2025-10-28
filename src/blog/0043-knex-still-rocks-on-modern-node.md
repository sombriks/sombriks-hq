---
layout: blog-base.webc
date: 2023-02-26
tags:
  - posts
  - node
  - knex
  - database migrations
  - koa
  - c8
  - mocha
  - chai
  - dotenv-flow
  - cross-env
---

# Knex rocks here's why

[Back in time](/blog/0005-updated-knex-bookshelf-cookbook/) i did a few
experiments and serious projects using [knex.js](https://knexjs.org/) and it
went well.

But it was some time ago and i was wondering if knex still worth the effort.

So here we are!

## Knex what?

It's a SQL query builder. Unlike traditional ORM frameworks, a query builder
doesn't tries to hide the database from you as much as possible.

Instead, you map your queries in a way that is easier to build queries, not
necessarily mapping entities.

Example, one could query books from a database like this using
[JPA](https://blog.payara.fish/getting-started-with-jakarta-ee-9-jakarta-persistence-api-jpa):

```java
//...
String q = "select b from Books b where b.title like concat('%', :title, '%')";
List<Book> books = entityManager
        .createQuery(q,Book.class)
        .setParameter("title","mancer")
        .getResultList();
// ...
```

We're omitting several things here like model mapping and persistence unit setup
but it's enough to feel how much indirection is involved.

If we decide to
use [spring repositories](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/),
things get a little better, but not that much:

```java
//...
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleLike(String title);
}
//...
List<Book> books = entityManager = repository.findByTitleLike("mancer");
// ...
```

Still need to define entity model but now we need to master the black magic of
proper naming your repository method name. And this thing has limitations as you
can imagine, making us to rely on @Query annotations which dumps us back to the
original issue with plain JPA.

[Gorm](https://gorm.io) gets simpler but doesn't land too far:

```go
//  db, err := gorm.Open(//...
var books []Books
// ...
db.Where("title LIKE ?", "%mancer%").Find(&books)
```

Again omitting the [entity mapping](https://gorm.io/docs/models.html) for the
sake of simplicity.

On node side, [Sequelize](https://sequelize.org/docs/v6/category/core-concepts/)
doesn't get much better:

```js
import {Book} from "../models"
import {Op} from "sequelize" 
//...
const books = await Book.findAll({
    where: {
        title: {
            [Op.substring]: 'mancer'
        }
    }
})
//...
```

The syntax looks a little clear but it's still an ORM and therefore we're still
facing undesired indirections on model mappings.

### Ok what about Knex?

With knex you can do this:

```js
//...
const books = await knex("books").whereLike("title", `%mancer%`)
//...
```

There are
[interesting variations](https://knexjs.org/guide/query-builder.html#wherelike)
of this, but you get the idea.

## So ORM's are bad

No, but they shouldn't stay on your way.

For instance, JPA, Spring Data and Sequelize (and
[Objection](https://vincit.github.io/objection.js/guide/getting-started.html)
too, which is built on top of knex) offers ways to skip all the model mapping
drama and access the database directly.

But there are scenarios where the advantages os that abstract layer worth the
effort.

It's just we're not here today to dig on those scenarios.

## A cleaner way to retrieve data

The simple and concise queries helps to keep tooling out of our way when doing
more important things.

A select, as you saw, is quite simple. Here goes a few more examples:

### Retrieve a single result

```js
// let isbn = "9788576573005"
//...
const book = await knex("books").where({isbn}).first()
//...
```

### Pagination

```js
const books = await knex("books")
    .whereLike("title", `%mancer%`).limit(10).offset(10)
```

### Total of records

Another common operation, [count](https://knexjs.org/guide/query-builder.html#count)
total results:

```js
const books = await knex("books")
    .whereLike("title", `%mancer%`).count("* as total")
```

### Search by fields on different tables

```js
const books = await knex("books").whereIn("authors_id", knex("authors")
    .select("id").whereLike("name", `%Will%`))
```

The select clause can be used to specify columns to participate in the results.

Nothing stops you from perform a query on book title and author name:

```js
// let q = 'o' 
const books = await knex("books")
    .whereLike("title", `%${q}%`)
    .orWhereIn("authors_id", knex("authors")
    .select("id").whereLike("name", `%${q}%`))
```

The [official docs has much more examples and useful tips](https://knexjs.org/)
on how to extract maximum results from your database, give it a try!

## Knex plays nicely with modern node

The first time i used knex, node ecosystem was completely built on top of
[commonjs](https://nodejs.org/docs/latest/api/modules.html#modules-commonjs-modules)
modules. And so was knex.

In 2016 a simple http service endpoint would look like this:

```js
// index.js
// database config and access with knex
var cfg = require("../knexfile.js")
var knex = require("knex")(cfg[process.env.NODE_ENV || "development"])

// good old express
var bodyParser = require("body-parser")
var app = require("express")()
app.use(bodyParser.json())

// quick and dirty
app.get("/books", function(req, res) {
    knex("books").whereLike("title", "%" + req.query.q + "%")
        .then(ret => res.send(ret))
})

// and of course make sure the database is ok before start to listen things
knex.migrate.latest().then(() => {
    app.listen(process.env.PORT || 3000)
})
```

By 2023 there is a few differences:

```js
// index.mjs
// database config and access with knex
import cfg from "../knexfile.cjs"
import Knex from "knex"

// Koa is the spiritual successor of express
import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";

const knex = Knex(cfg[process.env.NODE_ENV || "development"])

const app = new Koa()
app.use(bodyParser())

// quick and dirty
const router = new Router()
router.get("/books", async ctx => 
    ctx.body = await knex("books")
        .whereLike("title", `%${ctx.query.q}%`))

app.use(router.routes()).use(router.allowedMethods());

// and of course make sure the database is ok before start to listen things
knex.migrate.latest().then(() => {
    app.listen(process.env.PORT || 3000)
})
```

[Express](https://expressjs.com/) is simple and elegant, but
[Koa](https://koajs.com/) is brutal. Simpler, modular, ready for the future.

And keeps playing nice with Knex and other frameworks famous by being used with
express.

## Knex migrations still one of the best database migration tools ever made

[I wrote about migrations before,](/blog/?tag=database-migrations) but it's
never too much say how important is this topic is for modern application
development.

With migrations one can be sure about database schema version and application
expectations about this database since the app runs special scripts (the
migrations) to put the database in the expected state.

### Knex migrations basics

Enabling migrations on your project is easy as this:

```bash
npm i knex
npx knex init 
```

It generates a file called `knexfile.js` in the current folder. That folder
usually is the project root.

The config file itself looks like this:

```js
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
```

By default knex offers three configuration profiles, `development`, `staging`
and `production`, but in fact you can define whatever you want on this config
file:

```js
const _cfg = {
    client: 'better-sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: "db.sqlite3",
    },
    pool: {
        min: 2,
        max: 10
    },
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: { ..._cfg},
    test: {
        ..._cfg,
        connection: {
            filename: ':memory:'
        }
    },
    production: {
        ..._cfg,
        client: 'pg',
        connection: process.env.PG_CONNECTION_URL
    }
}
```

### Migration files

Create a migration file using knex is quite easy too:

```bash
npx knex migrate:make some_database_change 
```

It will create something like `migrations/20230226122114_some_database_change.js`
on your current directory and will look like this:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
```

A migration file has changes to be applied to the database, so it conforms with
the current app version.

You can learn more about how to fill those two functions
[here](https://knexjs.org/guide/schema-builder.html).

Knex offers that **up** and **down** functions, so you can write the database
changes in the **up** function.

#### What about the down function?

Migrations frameworks exists because database changes are hard. During
development, one could find that latest change did not work as expected, so it
must be unmade.

This is why the **down** exists.

But mind this: down functions are only useful **during development**, since
there is a real risk of **data loss** if they run on production environments.

So, **avoid to undo migrate executions on production**

### Migrations as es6 modules

So far we saw knex generating only commonjs modules, but hey, is this
supposed to be [modern node development](https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_enabling),
right?

For knexfile itself little can be done, you can rename it to **knexfile.cjs**,
so node understands what kind of module is it, but migration files can be
modern es6 modules with little effort. when creating a migration do this:

```bash
npx knex migrate:make --knexfile app/configs/knexfile.cjs -x mjs more_changes
```

This time the file generated is different:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  
};
```

We're not done, however.

If you decide to use es6 for your migration files, change the extension file
type on your knexfile:

```js
// part of knexfile.js 
development: {
    client: 'sqlite3',
        connection: {
        filename: './dev.sqlite3'
    },
    migrations: {
        loadExtensions: [".js", ".mjs"]
    },
},
// part of knexfile.js
```

If the migrations section does not exist, create one.

### Custom knexfile.cjs location

When designing a project architecture, a popular topic is the folder layout.

Some (me!) get passionate about it, and when knex forces us to keep that
migration folder toplevel to the project, not to mention the knexfile.js itself,
a bit of sadness might hit.

But it's not mandatory!

Let's say this is the project layout:

```bash
.
├── app
│   ├── configs
│   │   └── database.mjs
│   ├── index.mjs
│   ├── index.spec.mjs
│   └── routes
│       ├── books.mjs
│       └── books.spec.mjs
├── index.mjs
├── package.json
├── package-lock.json
└── README.md
```

Do your knex init as usual but then move `knexfile.js` to
`app/configs/knexfile.cjs`.

Next step is to avoid miscalculations on **migrations** folder.

By default, knex expects this folder to be toplevel, so migration folder is
derived from there.

To avoid this, set an absolute path to your migration folder. example:

```js
const _cfg = {
    client: 'better-sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: `${__dirname}/../../db.sqlite3`,
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory:`${__dirname}/migrations`,
        loadExtensions: [".mjs"],
    },
}
module.exports = {
    development: { ..._cfg},
    test: {
        ..._cfg,
        connection: {
            filename: ':memory:',
        }
    },
    production: {
        ..._cfg,
        client: 'pg',
        connection: process.env.PG_CONNECTION_URL
    }
}
```

That way you put your migrations folder any place you want.

Important: in order to use `knex migrate:make`, `knex migrate:latest`,
`knex migrate:rollback` and other knex commands, you must point to the new
knexfile location. example:

```js
npx knex migrate:make --knexfile app/configs/knexfile.cjs -x mjs new_column
```

```js
npx knex migrate:latest --knexfile app/configs/knexfile.cjs
```

It's possible to avoid those long and tedious commands by adding them  to the
project npm scripts:

```js
// part of package.json
"scripts": {
    "start": "node -r dotenv-flow/config index.mjs",
    "dev": "cross-env NODE_ENV=development nodemon -r dotenv-flow/config ",
    "test": "cross-env NODE_ENV=test c8 mocha -r dotenv-flow/config app/**/*",
    "migrate:make": "knex migrate:make --knexfile app/configs/knexfile.cjs -x mjs -- ",
    "migrate:latest": "knex migrate:latest --knexfile app/configs/knexfile.cjs",
    "migrate:rollback": "knex migrate:rollback --knexfile app/configs/knexfile.cjs"
},
// part of package.json
```

So you can do this to create a new migrate instead:

```bash
npm run migrate:make new_column
```

## Knex doesn't put itself between you and your testcases

When writing unit/integration testing it is important to be as true as possible
to the real/production environment. It doesn't mean that mocks are worthless,
just that tests in order to be trustful must perform real operations.

This is why tests should cover database operations, but predict database state
is not easy.

But it is easy when combining knex with
[configurable environment variables](https://www.npmjs.com/package/dotenv-flow).

In previous examples we already saw how it could work, by getting correct knex
configuration from knexfile using environment variables. That line wasn't there
without purpose:

```js
const knex = Knex(cfg[process.env.NODE_ENV || "development"])
```

Now setup dotenv-flow in the project root (no espace this time!). start by
creating the .env and .env override files:

```bash
.
├── app
│   ├── configs
│   │   ├── database.mjs
│   │   ├── knexfile.cjs
│   │   └── migrations
│   ├── index.mjs
│   ├── index.spec.mjs
│   └── routes
│       ├── books.mjs
│       └── books.spec.mjs
├── .env
├── .env.development
├── .env.development.local
├── .env.production
├── .env.test
├── index.mjs
├── package.json
├── package-lock.json
└── README.md
```

Each .env file can store specific environment variables that can work as
[feature-flags](https://en.wikipedia.org/wiki/Feature_toggle) inside the
project.

Depending on main state of NODE_ENV variable, some are enabled, some are not.

If there is need to override values locally, a .local file variant can be
provided.

Lastly, by no means push sensitive values inside .env files to source code
version control, it's ok to version the files with variable names, but
**all values must be empty** unless they are not sensitive.

### Test with mocha

Assuming this service:

```js
import { knex } from "../../configs/database.mjs"

export const listBooks = async (q = "") =>
  await knex("books").whereLike("title", `%${q}%`)
```

The test for it could be like this:

```js
import chai from "chai"

import { listBooks } from "./services.mjs"
import { knex, doMigrate } from "../../configs/database.mjs";

chai.should();

describe("Books service test", () => {

  // setup database for testing
  before(async () => await doMigrate())
  after(async () => await knex.destroy())

  it("should list all books", async () => {
    const books = await listBooks("")

    books.should.be.an("array")
    books.should.have.lengthOf(3)
  })

  it("should filter books by name", async () => {
    const books = await listBooks("neuro")

    books.should.be.an("array")
    books.should.have.lengthOf(1)
  })

})
```

Here the magic trick is the proper setup of knex. Knexfile must have a
**"test"** section (as saw in our previous example):

```js
// knexfile.cjs

test: {
..._cfg,
        connection: {
        filename: ':memory:'
    }
},
// knexfile.cjs
```

That way the database only existis during the test execution.

Thanks to `before(async () => await doMigrate())` and
`after(async () => await knex.destroy())`, connection pool is created and
destroyed during the testsuite lifecycle.

Lastly, `doMigrate` is a helper function to run migrations so the database will
be updated by the time of tests executions. You can use it to bootstrap the app
itself, since it will honor the config chosen by environment flags:

```js
// database.mjs

import Knex from "knex"
import cfg from "./knexfile.cjs"

const nodeEnv = process.env.NODE_ENV || "development"

export const knex = Knex(cfg[nodeEnv])

export const doMigrate = () => knex.migrate.latest(cfg[nodeEnv]);
```

### Coverage with c8

Lastly, you must make sure that the `test` npm script of your project sets the
proper environment variables so it will use the memory database during tests:

```bash
# put this on your npm scripts, but you can invoke it by hand anytime 
npx cross-env NODE_ENV=test c8 mocha -r dotenv-flow/config app/**/*

  Books service test
    ✔ should list all books
    ✔ should filter books by name


  2 passing (27ms)

------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------|---------|----------|---------|---------|-------------------
All files         |     100 |    85.71 |     100 |     100 |                   
 components/books |     100 |      100 |     100 |     100 |                   
  routes.mjs      |     100 |      100 |     100 |     100 |                   
  services.mjs    |     100 |      100 |     100 |     100 |                   
 configs          |     100 |       75 |     100 |     100 |                   
  database.mjs    |     100 |    66.66 |     100 |     100 | 4                 
  knexfile.cjs    |     100 |      100 |     100 |     100 |                   
------------------|---------|----------|---------|---------|-------------------
```

Thanks to [cross-env](https://www.npmjs.com/package/cross-env), the current
environment is explicit. Thanks to [dotenv-flow](https://www.npmjs.com/package/dotenv-flow),
it's possible to customize and override variables. and thanks to [c8](https://www.npmjs.com/package/c8)
we get a coverage report to better understand how the code behaves and how
trustful it is.

## Conclusion

Modern Knex is a nice piece of software which does it job and don't mess
with our productivity.

As shown, it plays very nice with companions frameworks offering different
solutions and degrees of abstraction ([Objection](https://vincit.github.io/objection.js/)
is an ORM on top of Knex) and offers easy steps for integration, if any.

Some sample code can be found
[here](https://github.com/sombriks/rosetta-beer-store/tree/master/beer-store-service-koa-knex),
and other samples [here](https://github.com/sombriks/simple-knex-koa-example).

May Knex helps you in your next project.

Happy Hacking.

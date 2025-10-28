---
layout: blog-base.webc
tags:
  - posts
  - test
  - node
  - koa
  - ava
  - sinon
  - supertest
  - good practices
  - SOLID principles
date: 2023-12-04
draft: false
---
# Testable code

Today i want to talk about tests, but from another perspective.

Is there code impossible to test?

What makes some piece of code easier or harder to test?

How did we end up mocking things?

## Is this impossible?

Take a look at the following code:

```javascript
import Knex from 'knex'
import Koa from 'koa'
import Router from '@koa/router'

const db = Knex({
  connection: 'postgresql://postgres:postgres@localhost:5432/bookshop',
  pool: { min: 1, max: 2 },
  client: 'pg'
})

const router = new Router()
router.get('/books', async ctx => 
  ctx.body = await db.knex('books').where(ctx.query))

const app = new Koa()
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
console.log(`api listening at http://localhost:3000`)
```

This code _works_, but it's a complete maintenance disaster.

- What if i need pagination support?
- What if i need proper input validation?
- How do i proper observe that in a production environment?
- How do i check if it's working _before_ put it in production?

Do not get me wrong, the simple snippet for fast, simple solutions is perfect,
but in healthy, alive projects, the code always get evolving.

So this code, the way it is (no validation, magic constants, no separation of
concerns), will bite you in the ankle soon or later.

## How hard could it be to test?

It depends on what this piece of code does. What is it doing?

- provision a database access
- provision a GET resource (list books) with rudimentar filter
- provision a service running on port 3000

Therefore we have at least three behaviors.

But how to test those?

### E2E test

The way this code is right now, it's a tight, single piece.

It's possible to test it with curl, making sure it's running and then hit it
with some predictable requests.

In one terminal, run your project:

```bash
# make sure it's running
node index.mjs 
```

In another, perform the request`

```bash
# hit it with some predictable requests
curl -i http://localhost:3000/books?author=Neil%20Gaiman | grep "HTTP/1.1 200"
```

If using [the sample project 01](https://github.com/sombriks/sample-testable-code/tree/main/01-barely-testable),
the output would be something like this:

```bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    57  100    57    0     0   1909      0 --:--:-- --:--:-- --:--:--  1965
HTTP/1.1 200 OK
```

Of course, [there are](https://www.cypress.io/) lots of
[other](https://www.postman.com/) E2E tools, but understand that it's not
mandatory to have a overly complex tooling for it.

### Integration test

Let's modify the code a little so we can get more freedom on how test things.
For now on, we'll have an entrypoint and we'll break requests, database and
queries in distinct modules:

```javascript
// app/database.mjs // database config
import Knex from 'knex'

export const db = Knex({
  connection: 'postgresql://postgres:postgres@localhost:5432/bookshop',
  pool: { min: 1, max: 2 },
  client: 'pg'
})
```

```javascript
// app/services.mjs // database queries mostly
import { db } from './database.mjs'

export const listBooks = async query =>
  await db('books').where(query)
```

```javascript
// app/requests.mjs // HTTP requests
import * as services from './services.mjs'

export const listBooks = async ctx =>
  ctx.body = await services.listBooks(ctx.query)
```

```javascript
// app/main.mjs, endpoints weaving 
import Koa from 'koa'
import Router from '@koa/router'

import * as requests from './requests.mjs'

export const app = new Koa()

const router = new Router()

router.get('/books', requests.listBooks)

app.use(router.routes())
app.use(router.allowedMethods())
```

```javascript
// index.mjs, entrypoint
import { app } from "./app/main.mjs"

app.listen(3000)
console.log(`api listening at http://localhost:3000`)
```

Using this new layout we can add a
[decent test library](https://github.com/avajs/ava) and
[other tools](https://github.com/ladjs/supertest) to embed the requests inside a
test suite:

```javascript
// app/app.test.mjs // testing request
import test from 'ava'
import request from 'supertest'

import { app } from './main.mjs'

test('should get books', async t => {
  //app.callback() returns a node http server compatible handler
  const result = await request(app.callback())
    .get('/books').expect('Content-Type', /json/)
  t.is(200, result.status)
})
```

The bonus here is we don't need a running server anymore to check if our request
is doing what it is supposed to do. We still need the database.

To be fair, not all that modularization was needed just for this integration
test case, but this will help with the next steps.

### Environments

Make the code aware that it's under test has great advantages. For instance,
having a testing environment can help us to get rid of our current dependency of
a running database when running tests.

We can rely on a local database like [sqlite](https://www.sqlite.org/index.html)
and a few initial state scripts managed by test suites to be sure about initial
database state.

In order to make different environments (for instance, development, production
and test) to the app, we'll use a library called
[dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow)

This is the best choice because it implements the
[12-factor](https://12factor.net/) specification very nicely.

We're changing our code again, mainly our database configuration and our test
suite:

```javascript
// app/database.mjs // database config
import Knex from 'knex'

const config = 'test' === process.env.NODE_ENV ? {
  connection: ':memory:',
  client: 'sqlite3'
} : {
  connection: process.env.PG_CONNECTION_URL,
  pool: { min: 1, max: 2 },
  client: 'pg'
}

export const db = Knex(config)
```

[The NODE_ENV variable](https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production)
is a well-know variable used to govern some aspects on node projects.

Given that our example does not use specific database features, it's ok swap
PostgreSQL with SQLite. Now our testcase must change, to provide a known initial
state for the test database:

```javascript
import test from 'ava'
import request from 'supertest'

import { db } from './database.mjs'
import { app } from './main.mjs'

test.before(async t => {
  const trx = await db.transaction()
  await trx.schema.createTable('books', t => {
    t.increments('id')
    t.string('title').notNullable()
    t.string('author').notNullable()
  })
  await trx.commit()

  const trx2 = await db.transaction()
  await trx2('books').insert([
    { title: 'American Gods', author: 'Neil Gaiman' },
    { title: 'Sandman', author: 'Neil Gaiman' },
    { title: 'Watchmen', author: 'Alan Moore' }
  ])
  await trx2.commit()
})

test('should get books', async t => {
  const result = await request(app.callback())
    .get('/books').expect('Content-Type', /json/)
  t.is(200, result.status)
  t.is(3, result.body.length)
})
```

There are several other strategies to keep a proper initial state, but
[database migrations](https://knexjs.org/guide/migrations.html#migration-cli)
are my favorite and i discussed it several times in the past.

## Mocks and unit tests

Even though we can fine-tune and tweak the application to be flexible enough by
just using what we already presented here, sometimes we don't need all living
parts to test something.

Some pieces of software can be tested without any special arrangement or just
using some replacement in order to proper test that behavior. Or at least is
should be possible.

When a test covers just one part of the software we call it unit test. I kinda
presented things here backwards because unit test is usually the first kind of
test one could produce, but i did that way because we started with a very
untestable example.

Even our current code can present us some challenges to perform unit test, so
we'll rewrite things again:

```javascript
// app/database.mjs
import Knex from 'knex'

export class Database {

  _knex = undefined

  get knex() {
    return this._knex
  }

  constructor(env, connectionUrl) {
    if ('test' === env) {
      this._knex = Knex({
        connection: ':memory:',
        client: 'sqlite3',
        pool: {
          min: 1,
          max: 1,
          idleTimeoutMillis: 360000 * 1000 // see https://github.com/knex/knex/issues/1871
        }
      })
    } else {
      this._knex = Knex({
        connection: connectionUrl,
        pool: { min: 1, max: 2 },
        client: 'pg'
      })
    }
  }
}
```

```javascript
// app/services.mjs
export class BookService {

  db = undefined

  constructor(db) {
    this.db = db
  }

  async listBooks(query) {
    return await this.db.knex('books').where(query)
  }
}
```

```javascript
// app/requests.mjs
export class BookRequests {

  service = undefined

  constructor(service) {
    this.service = service
  }

  async listBooks(ctx) {
    ctx.body = await this.service.listBooks(ctx.query)
  }
}
```

```javascript
// app/main.mjs
import Koa from 'koa'
import Router from '@koa/router'
import { Database } from './database.mjs'
import { BookService } from './services.mjs'
import { BookRequests } from './requests.mjs'

export const db = new Database(process.env.NODE_ENV, process.env.PG_CONNECTION_URL)
const service = new BookService(db)
const requests = new BookRequests(service)
export const app = new Koa()
const router = new Router()

router.get('/books', requests.listBooks.bind(requests))

app.use(router.routes())
app.use(router.allowedMethods())
```

Classes are _blueprints_ of what we want. They also ease the job of proper use
of dependency inversion, [the D in SOLID](https://en.wikipedia.org/wiki/SOLID).

Our previous testcase will look pretty much the same:

```javascript
import test from 'ava'
import request from 'supertest'

import { app, db } from './main.mjs'

test.before(async t => {
  const trx = await db.knex.transaction()
  await trx.schema.createTable('books', t => {
    t.increments('id')
    t.string('title').notNullable()
    t.string('author').notNullable()
  })
  await trx.commit()

  const trx2 = await db.knex.transaction()
  await trx2('books').insert([
    { title: 'American Gods', author: 'Neil Gaiman' },
    { title: 'Sandman', author: 'Neil Gaiman' },
    { title: 'Watchmen', author: 'Alan Moore' }
  ])
  await trx2.commit()
})

test('should get books', async t => {
  const result = await request(app.callback())
    .get('/books').expect('Content-Type', /json/)
  t.is(200, result.status)
  t.is(3, result.body.length)
})
```

But now we can write a testcase like this:

```javascript
// app/requests.test.mjs
import test from 'ava'
import sinon from 'sinon'

import { BookService } from './services.mjs'
import { BookRequests } from './requests.mjs'

test.before(t => {
  t.context = [
    { title: 'American Gods', author: 'Neil Gaiman' },
    { title: 'Sandman', author: 'Neil Gaiman' }
  ]
})

test('should call listBook request', async t => {

  const service = sinon.createStubInstance(BookService)
  service.listBooks.resolves(t.context)

  const requests = new BookRequests(service)
  const ctx = { query: { author: 'Neil Gaiman' } }

  await requests.listBooks(ctx)

  t.true(service.listBooks.called)
  t.is(ctx.body, t.context)
})
```

Where we can use a mock library called
[sinon](https://sinonjs.org/releases/latest/mocks/) and instead of perform all
heavy-lift of up entire application, we just pick one component to test and fake
everything else.

The main advantage of unit testing and mocking dependencies is the **speed**.
The drawback is of course the missing parts. It is possible that one unit test
passes while integration and E2E fail.

All in all, unit tests are self-contained, fast and usually reliable.

## Conclusion

Writing tests is the best way to grow confidence on the code regarding what it
is supposed to do. In a ever-evolving software solution, the complete test suite
is what keep us on track about how things are supposed to behave.

For future steps i recommend a good read on Continuous Integration, since the
tests must run (and always pass!) regularly.

As always, the complete source code can be found
[here](https://github.com/sombriks/sample-testable-code).

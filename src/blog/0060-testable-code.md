---
layout: blog-base.webc
tags:
  - posts
  - tests
  - node
  - koa
  - ava
  - sinon
  - supertest
  - good practices
  - SOLID principles
  - CI/CD
date: 2023-12-02
draft: true
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
// index.mjs, entrypoint
```

```javascript
// app/main.mjs, endpoints weaving 
```

```javascript
// app/database.mjs // database config
```

```javascript
// app/requests.mjs // HTTP requests
```

```javascript
// app/services.mjs // database queries mostly
```

Using this new layout we can add a
[decent test runtime](https://github.com/avajs/ava) and
[libraries](https://github.com/ladjs/supertest) to embed the requests inside a
test suite:

```javascript
// app/app.test.mjs // testing request

```

### Environments

## Mock polemics and unit tests

## Conclusion

---
layout: blog.pug
tags:
  - posts
  - node
  - javascript
  - typescript
  - ts-node
  - tsx
  - project structure
  - koa
  - sql
  - postgres
  - pglite
  - ava
  - test
  - supertest
  - github actions
date: 2024-07-16
draft: false
---
# Node backend validation exemplified

Hello!

Today we will discuss a little about data validation.

For some of you, the question might seems absurd, but it's a valid question for
anyone without any background, so: why validate data received from user or
external service? Because:

- No useful system can rely on random input.
- Core principle of communication is meaning.
- Data should be adherent to the system domain.
- The early we validate, early we handle problems.
- No backend service should blindly trust data received.

Let's see a few code examples for better comprehension of those topics.

## The database validates, but

Even if you don't write a single validation line in the application layer, if
your database is a relational one offering [ACID][ACID] capabilities, there is
validation.

But the same way your end-user should not be the one finding bugs, neither your
database should be the one performing validation.

For this example, we use [PGlite][PGlite], which is [PostgreSQL][postgres]
compiled to [web assembly][wasm]. There is many neat things possible from it but
let's discuss that later.

The following code potentially hits the database with invalid data:

```javascript
// services/addresses.js
async create({address}) {
  const {description, complement} = address;
  const {rows} = await db.query(`
        insert into addresses (description, complement)
            values ($1, $2)
                returning id`, [description, complement]);
  const [{id}] = rows;
  return id;
},
```

It is called from a request handler that is supposed to check received data but
doesn't:

```javascript
// controllers/addresses.js
async create(context) {
  const id = await addressesServices.create({address: context.request.body});
  context.status = 201;
  context.set('Location', `/addresses/${id}`); // Politely guide clients to somewhere else
  context.body = {message: `#${id} created`};
},
```

The context is a [Koa.Context][koa-context], and not a single line of validation
is present.

The address table in database is defined as follows:

```sql
create table addresses(
  id serial primary key,
  "description" text not null,
  "complement" text not null,
  created timestamp not null default now(),
  updated timestamp not null default now()
);
```

For the code, it doesn't matter if there is really a description and a
complement in the payload, it will pass potentially undefined values for the
database. But the table definition forbids null values, so your data consistency
is safe.

But the database is the last layer here, and potentially a constrained, shared
resource. If your application needs to handle huge traffic loads, it's not ideal
to let the database deals with that.

This kind of code is usually spotted on quick hacks, code samples and faulty
systems.

## Write validations by hand

Add some validation at application leve helps immensely to assure data quality.
For example, the previous controller can be improved to something like this:

```javascript
// controllers/addresses.js
  async create(context) {
    log.info('create address');
    const {description, complement} = context.request.body;
    if (!description) {
      log.warn('invalid address description');
      return context.throw(400, 'invalid address description');
    }

    if (complement === null || complement === undefined) {
      log.warn('invalid address complement');
      return context.throw(400, 'invalid address complement');
    }

    const id = await addressesServices.create({address: {description, complement}});
    context.status = 201;
    context.set('Location', `/addresses/${id}`); // Politely guide clients to somewhere else
    context.body = {message: `#${id} created`};
  },
```

This is enough to demand a valid description and complement (even allowing an
empty complement).

It's not perfect, however. Our example is small, and data validation is part of
controller concerns, but things can get complex.

## Using a validation library

Validation could be delegated to a specialized middleware in order to ease the
understanding of what is happening, and the specifics of what we expect to
receive from a request could be better described before we hand it out to the
controller code and finally to server and business specifics.

In this example we use [joi][joi]. There are many others, like [zod][zod],
[avj][avj], [yup][yup] and so on.

We can write a middleware to put in front of our request (which will revert to
the first version seen) and do proper checks on payload:

```javascript
import Joi from 'joi';
import { logger } from "./logging.js";

const log = logger.scope('validation.js')

// https://joi.dev/api/?v=17.13.3#general-usage
const addressSchema = Joi.object({
  id: Joi.number(),
  description: Joi.string().required(),
  complement: Joi.string().required().allow(''),
  created: Joi.date(),
  updated: Joi.date(),
});

export const ifValidAddress = async (context, next) => {
  log.info('validating address...')
  const { error } = addressSchema.validate(context.request.body)
  if (error) {
    log.warn(error);
    return context.throw(400, error);
  }
  return await next()
}
//...
```

And when wiring the api (here using a neat library called
[koa-api-builder][koa-api-builder]) we simply put the validator middleware in
front of our controller, like a pipeline:

```javascript
// server.js
// ...
const router = new ApiBuilder()
  .get('/health/status', context => context.body = 'ONLINE')
  .path('/addresses', b => {
    b.get('', addressesRequests.list);
    b.post('', ifValidAddress, addressesRequests.create); // validation in the first middleware
    b.path('/:id', b => {
      b.get('', addressesRequests.find);
      b.put('', addressesRequests.update);
      b.del('', addressesRequests.del);
      b.path('/people', b => {
        b.get('', ifValidId, addressesRequests.people.list);
        b.path('/:people_id', b => {
          b.put('', addressesRequests.people.add);
          b.del('', addressesRequests.people.del);
        });
      });
    });
  })
  // ...
  .build();
//...
```

Now we get a dedicated step for validation at application level. At runtime.
That's peak data manipulation.

You can test this endpoint with [ava][ava] and [supertest][supertest]:

```javascript
import test from 'ava';
import request from 'supertest';
import { testSetup, testTeardown } from '../configs/hook-test-context.js';

test.before(testSetup);

test.after.always(testTeardown);

// ...

test('should create address', async (t) => {
  const address = { description: 'El Dorado Rd 113', complement: '' };
  const result = await request(t.context.app.callback())
    .post('/addresses').send(address);
  t.truthy(result);
  t.is(result.status, 201);
  t.regex(result.headers.location, /\/addresses\/\d+/gi);
  t.regex(result.text, /created/gi);
});

test('should NOT create address due to invalid complement', async (t) => {
  const address = { description: 'El Dorado Rd 113' /* complement: '' */ };
  const result = await request(t.context.app.callback())
    .post('/addresses').send(address);
  t.truthy(result);
  t.is(result.status, 400);
  t.regex(result.text, /"complement" is required/gi);
});

// ...
```

What lies beyond?

## Static type checking

One thing which is good and at the same time bad about javascript is its dynamic
nature. Maintain a medium to large javascript project can be a nightmare if it
lacks a very comprehensive test suite.

[Typescript][typescript], the javascript superset with types, can complement the
testcase with [static type checking][typecheck] and better [LSP][lsp] hints in
your code editor.

It clearly goes beyond data input validation, but to assign types to your data
input makes the validation process even more efficient. Even for you, developer,
with your trained for code brain, it becomes easier to see what that request is
about:

```typescript
// controllers/addresses.ts
//...
async create(context: Context) {
  log.info('create address');
  const {description, complement} = context.request.body as Address;
  if(complement == undefined) return context.throw(400, `"complement" is required`);
  const id: number = await addressesServices.create({address: {description, complement}});
  context.status = 201;
  context.set('Location', `/addresses/${id}`); // Politely guide clients to somewhere else
  context.body = {message: `#${id} created`};
},
async update(context: Context) {
  const {id} = context.params as Person;
  const person = context.request.body as Person;
  const affected: number = await peopleServices.update({id, person});
  context.status = 303;
  context.set('Location', `/people/${id}`);
  context.body = {message: `${affected} updated`};
},
// ...
```

That way, given the proper setup, things get done faster and everyone goes gome
earlier.

But by adopting a type system may bring a few setbacks so beware with them.

### Type gymnastics

One can get very tempted to [type all the things][type-all-things] and forget to
actually implement working code.

A type is supposed indeed to narrow down a certain domain, but think about what
is best for a good shower: a glass of water or a few buckets of it?

Don't type everything, it makes the world smaller.

### Tooling drama

When doing project setup for the sample codes everything simply works. Except
for typescript tools.

For instance, [ts-node][ts-node].

This typescript engine is desirable because it delivers the same experience one
would have in a regular node project (i.e. no explicit build phase) but with
real first class type checking -- at compile-time and runtime too!

But it works fine just for the basics:

```console
> 04-address-book-ts-node@1.0.0 dev
> cross-env NODE_ENV=development nodemon -x ts-node -e ts -r dotenv-flow/config index.ts

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node -r dotenv-flow/config index.ts`
/home/sombriks/git/node-backend-validation/04-address-book-ts-node/node_modules/ts-node/dist/index.js:851
            return old(m, filename);
                   ^
Error [ERR_REQUIRE_ESM]: require() of ES Module /home/sombriks/git/node-backend-validation/04-address-book-ts-node/node_modules/@electric-sql/pglite/dist/index.js from /home/sombriks/git/node-backend-validation/04-address-book-ts-node/app/configs/database.ts not supported.
Instead change the require of index.js in /home/sombriks/git/node-backend-validation/04-address-book-ts-node/app/configs/database.ts to a dynamic import() which is available in all CommonJS modules.
    at require.extensions.<computed> [as .js] (/home/sombriks/git/node-backend-validation/04-address-book-ts-node/node_modules/ts-node/dist/index.js:851:20)
    at Object.<anonymous> (/home/sombriks/git/node-backend-validation/04-address-book-ts-node/app/configs/database.ts:4:18)
    at m._compile (/home/sombriks/git/node-backend-validation/04-address-book-ts-node/node_modules/ts-node/dist/index.js:857:29) {
  code: 'ERR_REQUIRE_ESM'
}
[nodemon] app crashed - waiting for file changes before starting...
```

Node ecosystem is vibrant ad quite fast-paced, major releases on every 6 months
is neat. It is changing for better, but ts-node falls behind.

On the other hand, [tsx][tsx] works fine:

```console
> 04-address-book-ts-node@1.0.0 dev:tsx
> cross-env NODE_ENV=development nodemon -x tsx -e ts -r dotenv-flow/config index.ts

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts
[nodemon] starting `tsx -r dotenv-flow/config index.ts`
[16/07/2024] [11:18:29] [server.ts] › ℹ  prepare server
[16/07/2024] [11:18:29] [no-rollback.ts] › ℹ  check database desired state/migrations...
[16/07/2024] [11:18:29] [no-rollback.ts] › ⬤  already executed: [2024-07-15T15:49:59.981Z] [app/configs/migrations/2024-07-14-start-schema.sql]
[16/07/2024] [11:18:29] [no-rollback.ts] › ℹ  done with database migration!
[16/07/2024] [11:18:29] [database.ts] › ℹ  { executed: [], status: 'success', total: 1 }
[16/07/2024] [11:18:29] [server.ts] › ℹ  server prepared!
[16/07/2024] [11:18:29] [index.ts] › ℹ  NODE_ENV is development
[16/07/2024] [11:18:29] [index.ts] › ℹ  http://0.0.0.0:3000
```

It [does not work exactly like ts-node][runtime-checking], but does the job.

## Benchmarks

Finally, one could ask: Which approach is the best, for real?

This is why we write down code and run plausible scenarios:

```javascript
import http from 'k6/http';
import { check } from 'k6';

// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/
export const options = {
  duration: '30s',
  vus: 10,
};

/**
 * scenario 01, simple addresses operations
 */
export default function () {
  // create address
  const payload = {
    description: `Addr no. ${new Date().getTime()}`,
    complement: `any ${100 * Math.random()}`
  }

  // success creating.
  const r1 = http.post('http://0.0.0.0:3000/addresses', payload);
  check(r1, {
    '201 created': r => r.status === 201,
  })

  // success listing. this one grows slower over the time. on purpose.
  const r2 = http.get('http://0.0.0.0:3000/addresses');
  check(r2, {
    '200 list ok': r => r.status === 200,
  })

  // creation failure, missing complement.
  delete payload.complement
  const r3 = http.post('http://0.0.0.0:3000/addresses', payload);
  check(r3, {
    '500 did not create / 400 missing complement': r => r.status === 500 || r.status === 400,
  })

  // find failure.
  const r4 = http.get('http://0.0.0.0:3000/addresses/-1');
  check(r4, {
    '404 not found / 400 invalid id': r => r.status === 404 || r.status === 400,
  })
}
```

Running it will give you results similar to this:

| Compute               | Scenario   | No Validation | Manual Validation | Joi       | TS-Node   |
|-----------------------|------------|---------------|-------------------|-----------|-----------|
| Mac M1 Air            | 30s / 10vu | 3447 runs     | 2684 runs         | 2660 runs | 2620 runs |
| Intel Core i7-1255U   | 30s / 10vu | 2470 runs     | 2517 runs         | 2531 runs | 2543 runs |
| AMD Ryzen 7 PRO 5850U | 30s / 10vu | 2123 runs     | 2100 runs         | 2145 runs | 2093 runs |

All tests executed with database initially empty.

### IO bound operations

Data validation to feed a relational database is, in the end, an IO-bound task.

That means your compute power only is relevant under heavy loads.

The benchmark numbers, in retrospect, lacks disk/ssd information, which i might
add in the future.

## Test action

At last but not least important, this github action can handle run the tests for
each project containing the snippets we presented in this article:

{% raw %}

```yaml
---
name: CI tests
on:
  push:
    branches: ["*"]
jobs:
  run-tests-example-01:
    defaults:
      run:
        working-directory: 01-address-book-no-validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: 01-address-book-no-validate/package.json
      - name: Run tests
        run: |
          npm ci
          npm run test:coverage
  run-tests-example-02:
    defaults:
      run:
        working-directory: 02-address-book-manual-validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: 02-address-book-manual-validation/package.json
      - name: Run tests
        run: |
          npm ci
          npm run test:coverage
  run-tests-example-03:
    defaults:
      run:
        working-directory: 03-address-book-joi
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: 03-address-book-joi/package.json
      - name: Run tests
        run: |
          npm ci
          npm run test:coverage
  run-tests-example-04:
    defaults:
      run:
        working-directory: 04-address-book-ts-node
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: 04-address-book-ts-node/package.json
      - name: Run tests
        run: |
          npm ci
          npm run test:coverage
```

{% endraw %}

### Further reading

This topic is rich, we could talk about [finite state machines][fsm],
[rule engines][rules], to cite only two closely related topics.

## Conclusion

Validation is one of the most important yet discrete topics in any backend
system, understand which validation degree you desire to apply to your project
and at what moment is a big decision.

You can find the complete source code [here][repo].

Happy hacking!

[ACID]: https://database.guide/what-is-acid-in-databases/
[PGlite]: https://www.npmjs.com/package/@electric-sql/pglite
[postgres]: https://www.postgresql.org/
[wasm]: https://webassembly.org/
[koa-context]: https://github.com/koajs/koa/blob/master/docs/api/context.md
[joi]: https://joi.dev
[zod]: https://zod.dev/
[avj]: https://ajv.js.org/
[yup]: https://yup-docs.vercel.app/
[koa-api-builder]:https://github.com/sombriks/koa-api-builder
[ava]: https://github.com/avajs
[supertest]: https://github.com/ladjs/supertest
[typescript]: https://www.typescriptlang.org/
[typecheck]: https://en.wikipedia.org/wiki/Type_system#Static_type_checking
[lsp]: https://langserver.org/
[type-all-things]: https://duckduckgo.com/?q=how+to+creat+positive+number+type+in+typescript
[ts-node]: https://typestrong.org/ts-node/docs/
[tsx]: https://tsx.is/getting-started
[runtime-checking]: https://tsx.is/usage#no-type-checking
[fsm]: https://en.wikipedia.org/wiki/Finite-state_machine
[rules]: https://en.wikipedia.org/wiki/Business_rules_engine
[repo]: <https://github.com/sombriks/node-backend-validation>

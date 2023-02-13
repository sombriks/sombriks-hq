---
layout: base.webc
tags: posts
date: 2018-12-25
---
# The updated knex + bookshelf cookbook

| TOC                                                                     |
| ----------------------------------------------------------------------- |
| - How to create a table using knex migrate                              |
| - How to insert initial data                                            |
| - How to add a column into a table                                      |
| - How to create foreign keys                                            |
| - How to create views                                                   |
| - How to update views                                                   |
| - How to use bookshelf models                                           |
| - How to map bookshelf relations                                        |
| - How to easily expose basic CRUD operations with bookshelf and express |

So, [a long time ago](https://sombriks.blogspot.com/2016/10/yet-another-knex-migrations-cookbook.html)
i wrote down a few useful patterns when working with
[knex](https://knexjs.org/) to query a database. Since i added the
[bookshelf](https://bookshelfjs.org/) into this game, it's fair talk about it again.

Also, i fixed the highlight thing on this shiny new blog :-)

## But wait, databases, knex, bookshelf, what is it all about

- [Database](https://en.wikipedia.org/wiki/Database) is the other name of
  [PostgreSQL](https://www.postgresql.org/).
- knex is a _query builder_, which simply means that it helps you to write less
  to get your data from the database.
- bookshelf is an [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping)
  built on top of knex.

Those things helps you to write better javascript applications and that's it.

## How to get started

Create a server-side javascript project so we can set up a database and a
rest service to expose it:

```bash
# i assume that you have node/npm
mkdir theproject
cd the project
npm init -y
npm install express body-parser cors morgan common-routes bookshelf bookshelf-page knex express sqlite3 --save
```

Once the project finishes the downloading, you must perform the `knex init` thing:

```bash
npx knex init
# if you don't have npx upgrade your npm and node
```

It creates the `knexfile.js` for this project. I'll explain it later.

## How to create a table using knex migrate

In order to keep the database tamed, it's very important to keep tracking on
changes into the schema.

Create your first migration with this command:

```bash
$ npx knex migrate:make initial_schema
Using environment: development
Created Migration: /Users/sombriks/Documents/theproject/migrations/20181224231537_initial_schema.js
```

The output file will be inside a new folder called **migrations** and will be
pretty much like this:

```javascript
exports.up = function(knex, Promise) {};

exports.down = function(knex, Promise) {};
```

The knex documentation has a section entirely about [schema management](https://knexjs.org/#Schema).

Change the migrate and create your first table:

```javascript
exports.up = knex =>
  knex.schema.createTable("user", tb => {
    tb.increments("user_id");
    tb.timestamp("user_dtcreation")
      .notNullable()
      .defaultTo(knex.fn.now());
    tb.string("user_name").notNullable();
    tb.string("user_password").notNullable();
    tb.string("user_email")
      .notNullable()
      .unique();
  });

exports.down = knex => knex.schema.dropTable("user");
```

The up and the down functions can be arrow functions, no problem!

The **up** function is the important one, since every migrate created to
upgrade the schema will run the up functions.

In order to execute the migration, do this:

```bash
npx knex migrate:latest
```

The **down** function has a role in development time, when you are testing the
schema modification. If something does not looks fine, run this:

```bash
npx knex migrate:rollback
```

## How to insert initial data

Simply create a migrate to do that:

```bash
$ npx knex migrate:make initial_data
Using environment: development
Created Migration: /Users/sombriks/Documents/theproject/migrations/20181225005001_initial_data.js
```

Then make sure the **up** has the inserts and the **down** has the deletes:

```javascript
const payload = [
  {
    user_name: "Alice",
    user_password: "123456",
    user_email: "alice2018@foobar.com"
  },
  {
    user_name: "Bob",
    user_password: "123456",
    user_email: "bob2018@foobar.com"
  },
  {
    user_name: "Joe",
    user_password: "123456",
    user_email: "joe2018@foobar.com"
  },
  {
    user_name: "Mary",
    user_password: "123456",
    user_email: "mary2018@foobar.com"
  }
];

exports.up = knex => knex("user").insert(payload);

exports.down = knex =>
  knex("user")
    .del()
    .whereIn("user_email", payload.map(e => e.user_email));
```

You can also use this alternative form for the down/delete:

```javascript
exports.down = (knex,Promise) =>
  Promise.each(payload, p => knex("user")
    .del().where("user_email", p.user_email)
```

## How to add a column into a table

Simply create a migrate to do the job.

```bash
$ npx knex migrate:make alter_table_user_add_birthdate_column
Using environment: development
Created Migration: /Users/sombriks/Documents/theproject/migrations/20181225010726_alter_table_user_add_birthdate_column.js
```

```javascript
exports.up = knex =>
  knex.schema.table("user", tb => {
    tb.date("user_birthdate");
  });

exports.down = knex =>
  knex.schema.table("user", tb => {
    tb.dropColumn("user_birthdate");
  });
```

You may think "oh, i could just change previous migrate", but this is not how
migrates work.

Once a migrate runs in production, that's over. You shall never ever change it
again.

## How to create foreign keys

```javascript
// create table party
exports.up = knex =>
  knex.schema.createTable("party", tb => {
    tb.increments("party_id");
    tb.timestamp("party_dtcreation")
      .notNullable()
      .defaultTo(knex.fn.now());
    tb.string("party_name").notNullable();
    tb.integer("user_id")
      .references("user.user_id")
      .comment("the user throwing the party");
  });

exports.down = knex => knex.schema.dropTable("party");
```

Please note that a good schema will cope well with cascade:

```javascript
// create pivot party_user
exports.up = knex =>
  knex.schema.createTable("party_user", tb => {
    tb.integer("party_id")
      .notNullable()
      .references("party.party_id")
      .onDelete("cascade");
    tb.integer("user_id")
      .notNullable()
      .references("user.user_id")
      .onDelete("cascade");
    tb.unique(["party_id", "user_id"]);
  });

exports.down = knex => knex.schema.dropTable("party_user");
```

The `.onDelete("cascade")` thing means that if the foreign entry gets deleted
the entry in this table vanishes too.

## How to create views

Knex does not have any helper function in this case. It is possible however do
the job using [knex.raw](https://knexjs.org/#Raw) mode:

```javascript
// create view guests
exports.up = knex =>
  knex.raw(`
  create view guests as
    select * from party
    natural join party_user
    natural join user
`);

exports.down = knex => knex.raw("drop view guests");
```

## How to update views

Create a migrate _undoing_ the view using knex.raw, modify the tables
involved on a second migrate then create it again on the third migrate.

It takes three migrates because each migrate runs inside a transaction.

## How to use bookshelf models

```javascript
// index.js
const env = process.env.NODE_ENV || "development";
const cfg = require("./knexfile");

const knex = require("knex")(cfg[env]);
const Bookshelf = require("bookshelf")(knex);

const User = Bookshelf.Model.extend({
  idAttribute: "user_id",
  tableName: "user"
});

User.query().then(console.log);
// similar to
knex("user")
  .select()
  .then(console.log);
```

Unlike other ORM's, all you need to tell to bookshelf is the table name and
the id column.

The `query()` function is very versatile

## How to map bookshelf relations

Bookshelf relations can be used to represent 1:1, 1:N or N:N
[cardinalities](<https://en.wikipedia.org/wiki/Cardinality_(data_modeling)>) It
also provides an elegant way to do the "select 1 + N query" in a good and
transparent way.

```javascript
// index.js
const env = process.env.NODE_ENV || "development";
const cfg = require("./knexfile");

const knex = require("knex")(cfg[env]);
const Bookshelf = require("bookshelf")(knex);

const User = Bookshelf.Model.extend({
  idAttribute: "user_id",
  tableName: "user"
});

const Party = Bookshelf.Model.extend({
  idAttribute: "party_id",
  tableName: "party",
  host() {
    return this.belongsTo(User, "user_id");
  },
  guests() {
    return this.belongsToMany(User, "guests", "party_id", "user_id");
  }
});

Party.forge()
  .fetch({ withRelated: ["host", "guests"] })
  .then(console.log);
```

## How to easily expose basic CRUD operations with bookshelf and express

Use the [common-routes](https://www.npmjs.com/package/common-routes) package:

```javascript
// index.js
const env = process.env.NODE_ENV || "development";
const cfg = require("./knexfile");

const knex = require("knex")(cfg[env]);
const Bookshelf = require("bookshelf")(knex);
Bookshelf.plugin("bookshelf-page");

const commonRoutes = require("common-routes");
const express = require("express");
const { json } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(json());
app.use(cors());
app.use(morgan("dev"));

const User = Bookshelf.Model.extend({
  idAttribute: "user_id",
  tableName: "user"
});

const Party = Bookshelf.Model.extend({
  idAttribute: "party_id",
  tableName: "party",
  host() {
    return this.belongsTo(User, "user_id");
  },
  guests() {
    return this.belongsToMany(User, "guests", "party_id", "user_id");
  }
});

const r1 = new express.Router();
const r2 = new express.Router();

commonRoutes.apply(r1, User);
commonRoutes.apply(r2, Party, ["host", "guests"]);

app.use("/user", r1);
app.use("/party", r2);

knex.migrate
  .latest()
  .then(_ => app.listen(3000, _ => console.log("App online")));
```

The common-routes requires the bookshelf-page plugin and json body-parser to
work properly.

It adds regular crud operations using semantic http verbs to do it.

In the snippet above, the available REST routes are these:

| uri         | verb | description                          | example                        |
| ----------- | ---- | ------------------------------------ | ------------------------------ |
| /user/list  | GET  | list users, 10 per page by default   | /user/list?page=2&pageSize=15  |
| /user/:id   | GET  | fetch user by id                     | /user/12                       |
| /user/save  | GET  | creates a new user                   | /user/save                     |
| /user/save  | GET  | updates an existing user             | /user/save                     |
| /user/:id   | GET  | delete user by id                    | /user/12                       |
| /party/list | GET  | list parties, 10 per page by default | /party/list?page=2&pageSize=15 |
| /party/:id  | GET  | fetch party by id                    | /party/12                      |
| /party/save | GET  | creates a new party                  | /party/save                    |
| /party/save | GET  | updates an existing party            | /party/save                    |
| /party/:id  | GET  | delete party by id                   | /party/12                      |

## What now

Bookshelf, knex, express and a relational database can deliver solutions quite
fast if you know what you're doing. These snippets are just a sample of what is
possible.

You can find the complete source code [here](https://github.com/sombriks/sample-knex-bookshelf-cookbook).

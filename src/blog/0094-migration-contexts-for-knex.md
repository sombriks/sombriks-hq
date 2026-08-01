---
layout: blog-layout.pug
tags:
  - posts
  - knex
  - liquibase
  - java
  - node
date: 2026-08-01
draft: false
---
# Migration contexts for Knex.js

In this article let's present a simple guide on how to get something similar to 
Java/Liquibase contexts using Node.js/Knex.js and why it matters.

## What is a migration 

Applications bounded to a [relational database][postgresql] must honor the 
database schema contract. It must be aware of the database state so it does not 
goes into undefined behaviors (aka bugs).

[postgresql]: https://www.postgresql.org/

One way to accomplish this is to check and enforce the database schema and 
state actively, performing metadata queries and executing scripts.

That metadata and scripts goes nowadays by names like _changelog_, _migration_ 
and so on.

If you touched some 'modern' enterprise project over the past years, you 
probably know names like flyway, liquibase, mybatis-migrations, knex or some 
other fancy technology designed for that end.

### What is a migration context

Contexts are related to the [twelve-factor][twelve-factor] manifest because it 
attempts to relate what should be the database state with the current 
application environment. 

[twelve-factor]: https://12factor.net/

If the application is running in development mode, the database state should be 
slightly different from the expected state in production mode.

## What is Liquibase

[Liquibase][liquibase] is (IMHO) the best tool to perform database migration in 
java-based projects.

[liquibase]: https://www.liquibase.com/

With Liquibase, it's possible to:

- create simple SQL scripts
- use alternative languages, like xml, json or yaml
- create up/down sessions in scripts, for development purposes
- check the scripts integrity, making sure that what you have is what was 
  actually executed
- integrate with solutions from the [spring][spring] ecosystem

[spring]: https://spring.io/

### Liquibase contexts

[Contexts in liquibase][ctx] allows to define that a certain 
script only should run on certain environment combination.

[ctx]: https://docs.liquibase.com/secure/user-guide-5-1/what-is-a-changeset



```sql
-- liquibase formatted sql

-- changeset username:script-id context:dev,prod,test

create table example(id bigserial primary key, description varchar);

-- rollback: drop table example;
```

The changeset line sets username and unique id for the changeset in the script, 
and the context attribute sets 3 contexts that can be selected at runtime.

By default, if no context is provided, the script will run at all contexts.

## What is Knex.js

[Knex.js][knex] is a Popular, battle-tested and reliable query-builder for 
Node.js projects.

[knex]: https://knexjs.org/

It eases the burden of context switching and data mapping between javascript 
and sql queries. It performs a remotely similar job done by [Mybatis][mybatis] 
in java ecosystem.

[mybatis]: https://blog.mybatis.org/

It offers in its migration system:

- javascript migrations using the knex schema builder api, along the query api
- up and down support for the migrations
- environment-aware configuration

### Knex environments

Unlike Liquibase, there is no such thing as contexts in the knex migration api. 
Instead, the [knexfile.js][knexfile.js] is expected to export one configuration 
per environment. For example:

[knexfile.js]: https://knexjs.org/guide/migrations.html#knexfile-js

```javascript
export default {
  development: {
    client: 'pg',
    connection: { user: 'me', database: 'my_app' },
    migrations: {
      directory: './migrations'
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations'
    },
  },
};
```

Then you get the proper configuration according to the environment:

```javascript
import Knex from 'knex';
import config from './knexfile.js';

export db = Knex(config[process.env.NODE_ENV ?? 'development']);
```

## The difference

As you can see, there is no per-script setting in Knex to determine if a script 
should execute or not. all you can set is the directory containing the scripts 
to execute.

## The solutions

Hopefully, the migration section can support ot only one directory, but a list 
of directories. 

That way, this configuration is perfectly valid:

```javascript
const common = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 5,
    }
};

const common = './migrations/common';
const development = './migrations/development';
const production = './migrations/production';
const test = './migrations/test';

export default {
  development: {
    ...common,
    migrations: {
      directory:[development, common]
    },
  },
  test: {
    ...common,
    migrations: {
      directory:[test, common]
    },
  },
  production: {
    ...common,
    migrations: {
      directory:[production, common]
    },
  },
};
```

That way, the common directory will be evaluated on all environments and 
dedicated directories enters only in their specific configurations.

## Conclusion

This approach is not 100% equivalent to contexts, since in contexts it's 
possible to negate a context execution, while in the environment folders 
strategy only cleverly share folders are available.

So this is it, happy hacking!


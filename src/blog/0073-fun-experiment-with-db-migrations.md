---
layout: blog-layout.pug
tags:
  - posts
  - node
  - java
  - javascript
  - sql
  - database migrations
  - mybatis
  - sqlalchemy
  - knex
  - dbmate
  - liquibase
  - flyway
  - rails
date: 2024-09-03
draft: false
---
# A fun experiment with database migrations

The other day i got hooked on a thread about why there where no simpler database
migrations frameworks for java.

[I felt challenged][challenge].

## But what is a migration system?

It is pretty common that every change in the database applies also changes into
the application and vice-versa.

Handle such changes isn't always straightforward and often error-prone. Changes
in application must be in perfect sync with changes in database and it is
critical to define a source of truth regarding which change is primary and which
change is consequence of the first one.

To solve that, assuming that changes on application behavior are the primary
ones, this special pattern is implemented: application applies changes in the
database so it reflects the expected state for the correct application function.

It often relies on a special table containing metadata regarding which changes
where already applied into the database.

This is what we call database migration system.

## Noteworthy migration systems

_Most famous_ migration systems are:

- [Mybatis migrations][mybatis] for jvm
- [Liquibase][liquibase] for jvm
- [Flyway][flyway] for jvm
- [Knex migrations][knex] for node
- [dbmate][dbmate] for golang
- [Active Records Migrations][rails-migrations] for ruby
- [SQLAlchemy migrate][sql-alchemy] for python

## Minimum features of a migration system

Some migration systems offers quite sophisticated options, command line
interfaces, dsls and integrations beyond imagination.

But are those essential? what would be a _bare-bones_ migration system?

- Are [migration contexts][migration-contextes] essential?
- Are [command line tools][migration-cli] essential?

Other features like [baselines][migration-baseline],
[schema dumps][migration-schema-dump], [ups and downs][migrate-up-down] and so
on might be useful, but not essential.

In fact, migration systems can be as simple as run a bunch of statements during
the configuration/startup phase of the application.

And this is all about the challenge is.

## The challenge

"A minimal migration system for java (and maybe other languages) as simple as
possible."

This is how i can describe the **no-rollback-from-here**

It tackles down:

- migration metadata table
- migration lock table

And that's it.

Contexts? Not my problem.

Migrations folder? It's up to you.

Want to [avoid to use SQL directly][schema-builder]? Not today.

But you still get migrations to apply and still controls the desired database
state:

```javascript
import {default as sqlite3} from "sqlite3"
import {NoRollback} from 'no-rollback-node'

const connection = new sqlite3.verbose().cached.Database('./todos.db')

const migrator = NoRollback({connection, dbType: 'sqlite'});

await migrator.migrate(['my-migration.sql'])

console.log(migrator)

connection.get('select * from todos', (err, result) => {
  if (err) throw err;
  console.log(result)
})
```

And the content of `my-migration.sql`:

```sql
-- here we go
create table todos
(
    id          integer primary key,
    description text      not null,
    done        boolean   not null default false,
    created     timestamp not null default current_timestamp
);

insert into todos(description)
values ('walk dog'),
       ('do the dishes'),
       ('publish npm package');
```

You don't need more than that to keep decent control of you database.

Oh, but this is the javascript version. This is the java one:

```java
package example.norollback;

import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.ext.web.Router;
import norollback.NoRollbackFromHere;
import org.jdbi.v3.core.Jdbi;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Timestamp;
import java.util.List;

record Todos(int id, String description, boolean done, Timestamp created) {
}

public class MytodolistMain {

    private final HttpServer server;

    public MytodolistMain() throws Exception {
        Connection con = DriverManager.getConnection("jdbc:h2:./todos");
        Vertx vertx = Vertx.vertx();
        Jdbi jdbi = Jdbi.create(con);

        NoRollbackFromHere noRollback = new NoRollbackFromHere(getClass());
        noRollback.migrate(con,
                "/migrations/202407280927-create-schema.sql",
                "/migrations/202407281141-sample-data.sql"
        );
        System.out.println(noRollback.getSuccess());
        System.out.println(noRollback.getFailed());
        System.out.println(noRollback.getDonePrevious());

        Router router = Router.router(vertx);

        router.route(HttpMethod.GET, "/todos").handler(ctx -> {

            List<Todos> todos = jdbi.withHandle(handle ->
                    handle.createQuery("select * from todos")
                            .map((rs, stmtCtx) -> new Todos(
                                    rs.getInt("id"),
                                    rs.getString("description"),
                                    rs.getBoolean("done"),
                                    rs.getTimestamp("created")
                            )).list());

            ctx.json(todos);
        });

        server = vertx.createHttpServer().requestHandler(router);
    }

    public static void main(String[] args) throws Exception {
        new MytodolistMain().server.listen(8080)
                .onSuccess(ctx -> System.out.println("HTTP server started on http://0.0.0.0:8080"));
    }
}

```

That would be even simpler, sure, but look at this example: a simple service
endpoint with database support in just a few lines.

## And that's it

Sometimes we tend to think about some solutions as too complex and very
demanding on maintenance and therefore we _must_ adopt the best one already
available in the wild. That's not always true.

Some patterns are simpler than they seems and can be implemented with just a
couple of functions and good will.

The sample code is [here][challenge] and there is a couple of libraries
published, but as you can see you can create your own migration strategy very
quickly if you want.

Happy hacking!

[challenge]: https://github.com/sombriks/no-rollback-from-here
[mybatis]: https://mybatis.org/migrations/
[liquibase]: https://www.liquibase.com/
[flyway]: https://www.red-gate.com/products/flyway/community/
[knex]: https://knexjs.org/guide/migrations.html
[dbmate]: https://github.com/amacneil/dbmate
[rails-migrations]: https://guides.rubyonrails.org/active_record_migrations.html
[sql-alchemy]: https://sqlalchemy-migrate.readthedocs.io/en/latest/
[migration-contextes]: https://docs.liquibase.com/concepts/changelogs/attributes/contexts.html
[migration-cli]: https://sqlalchemy-migrate.readthedocs.io/en/latest/versioning.html#create-a-change-repository
[migration-baseline]: https://documentation.red-gate.com/fd/baseline-184127456.html
[migration-schema-dump]: https://edgeguides.rubyonrails.org/active_record_migrations.html#schema-dumping-and-you
[migrate-up-down]: https://mybatis.org/migrations/updown.html
[schema-builder]: https://knexjs.org/guide/schema-builder.html

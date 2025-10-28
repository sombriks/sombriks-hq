---
layout: blog.pug
tags:
  - posts
  - kotlin
  - javalin
  - sql
  - jdbc
  - db2
  - docker
  - docker-compose
date: 2023-05-14
draft: false
---
# IBM DB2 quick overview

In this article we showcase a really quick and dirty db2 usage. Because.

## The database for big business?

I always tought about IBM DB2 as the database for the
[big iron](https://www.youtube.com/watch?v=H_hRcidYj4Y), the corporative beast
holding the world economy.

On the other hand, also amazes me how little material exists showing off DB2
outside this walled garden.

This might explain why there is no official [knex](https://knexjs.org/) support
for DB2.

## Running a DB2 instance

In order to get a working DB2, one easy way is to go into ibm cloud and
[provision one](https://www.ibm.com/br-pt/cloud/db2-on-cloud).

The other option is to spin up a [container](https://hub.docker.com/r/ibmcom/db2).

**NOTE:** due to recent docker hub changes that image will vanish. Test this one
while you still can.

A handy `docker-compose.yml` file would look like this:

```yml
# docker-compose-development.yml
# this compose spins up a db2 database for development purposes
version: "3"
services:
  db2:
    image: ibmcom/db2:11.5.8.0
    privileged: true
    expose:
      - 50000
    ports:
      - "50000:50000"
    environment:
      LICENSE: accept
      DBNAME: sample
      DB2INSTANCE: db2inst1
      DB2INST1_PASSWORD: change-me-please
```

## Connect into it from IDE

Once (it takes time!) the container finishes to spin up, we're good to connect:

![sample-connection.png](/post-pics/0052-ibm-db2-quick-overview/sample-connection.png)

Again, it might take some time.

## Connect it from the application

In this example we'll connect into it using [Kotlin](https://kotlinlang.org/), a
modern language running on top of the
[java virtual machine](https://www.oracle.com/java/technologies/downloads/).

```kotlin
package me.sombriks

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.*
import me.sombriks.config.InitConfig
import me.sombriks.controller.TodoController
import me.sombriks.service.TodoService
import javax.sql.DataSource

fun main(args: Array<String>) {

    val dataSource: DataSource = HikariDataSource(
        HikariConfig(
            "/datasource.properties"
        )
    )

    InitConfig.initDb(dataSource)

    val service: TodoService = TodoService(dataSource)
    val controller: TodoController = TodoController(service)

    val app = Javalin.create {
        // config
    }

    app.routes {
        path("/todos") {
            get(controller::listTodos)
            post(controller::insertTodo)
            path("/{id}") {
                get(controller::findTodo)
                put(controller::updateTodo)
                delete(controller::delTodo)
            }
        }
    }

    app.start(7070)
}
```

This code samples [HikariCP](https://github.com/brettwooldridge/HikariCP) as
datasource provider and [Javalin](https://javalin.io/) as our service provider
(it has a very beautiful and modern way to build java api's)

Other technologies participate too, but those two are the noteworthy.

The datasource configuration itself comes from a file from classpath (the
starting '/' makes Hikari search classpath for this file) called
`datasource.properties`:

```properties
# hikari pool properties
# https://github.com/brettwooldridge/HikariCP#gear-configuration-knobs-baby
jdbcUrl=jdbc:db2://127.0.0.1:50000/sample
driverClassName=com.ibm.db2.jcc.DB2Driver
username=db2inst1
password=change-me-please
minimumIdle=2
maximumPoolSize=10
```

## Miscellaneous

One quirk encountered was the chose of the right jdbc driver.
[There are a few ones](https://mvnrepository.com/search?q=db2&d=com.ibm), but
[this is the right one](https://mvnrepository.com/artifact/com.ibm.db2/jcc).

Aside the propaganda, DB2 is... one of the database engines ever made.

One funny thing noteworthy is the db2 features
[the longest auto increment primary column syntax](https://stackoverflow.com/questions/13466347/how-to-auto-increment-in-db2/13467539?stw=2#13467539)
i ever saw.

## Conclusion

The source code for this article can be found
[here](https://github.com/sombriks/sample-kotlin-db2).

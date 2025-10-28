---
layout: blog.pug
tags:
  - posts
  - kotlin
  - javalin
  - liquibase
  - jdbi
  - sql
  - vue
  - h2
date: 2023-05-28
draft: false
---
# Lightweight database access with jdbi

In this post we'll sample a nice framework called [jdbi](https://jdbi.org/).

## Why not JPA or something else?

[JPA](https://jakarta.ee/specifications/persistence/) is a handy and exellent
specification, don't get me wrong. Manually deals with
[JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/)
is still a herculean task and might not worth the expected performance gain.

On the other hand, JPA delivers lots of solutions for problems that you might
not have yet and keep remembering all the time that joinColumn relates to the
side 'owning' the relation and the inverseJoinColumn relates to the 'owned' side
is tiresome

But let's not keep doing this 'why not X' exercise because we could do the same
for [mybatis](https://mybatis.org/mybatis-3/), [jooq](https://www.jooq.org/),
you name the next one.

## Why jdbi?

- Lightweight
- Easy to understand
- Easy to integrate
- Scales well, up and down

The api itself is [quite beautiful](https://jdbi.org/#_api_overview), you can
choose what style pleases you more and is easier to maintain.

## Combining with other (lightweight) frameworks

We'll use [Kotlin language](https://kotlinlang.org/) here and one could argue
that we're adding unnecessary dependencies, but for the sake of consistency this
single compromise we will do.

When aiming for low resource consumption, there are a few other options in sight
to combine with jdbi:

- [javalin](https://javalin.io/) to serve and design our service api
- [vue.js](https://vuejs.org/) for a small frontend to consume out api

Javalin offers builtin support for vue so let's take advantage onf it.

Additionally, we'll use [H2 database](https://www.h2database.com/html/main.html)
just for simplicity and [liquibase](https://www.liquibase.com/) to proper manage
the database state.

At last but not least, use [https://sdkman.io/](https://sdkman.io/) to install
other needed tools like [maven](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html).

## Creating the project

Install maven (if not already present) using the sdk command:

```bash
sdk install maven
```

Create a maven project **(i wish there was a smaller command line for it)**:

```bash
mvn archetype:generate -DinteractiveMode=false \
                       -DgroupId=sample.jdbi.javalin \
                       -DartifactId=sample-jdbi-javalin \
                       -DarchetypeGroupId=org.jetbrains.kotlin \
                       -DarchetypeArtifactId=kotlin-archetype-jvm \
                       -DarchetypeVersion=1.8.21
```

## Adding javalin dependencies and a few others

In the generated project, add javalin, jdbi, hikariCP, liquibase and h2 database
and a few others as dependencies in the pom.xml file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>sample.jdbi.javalin</groupId>
    <artifactId>sample-jdbi-javalin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>sample.jdbi.javalin sample-jdbi-javalin</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <kotlin.version>1.8.21</kotlin.version>
        <kotlin.code.style>official</kotlin.code.style>
        <junit.version>4.13.1</junit.version>
    </properties>

    <dependencies>

        <!-- https://mvnrepository.com/artifact/io.javalin/javalin -->
        <dependency>
            <groupId>io.javalin</groupId>
            <artifactId>javalin</artifactId>
            <version>5.5.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.jdbi/jdbi3-kotlin-sqlobject -->
        <dependency>
            <groupId>org.jdbi</groupId>
            <artifactId>jdbi3-kotlin-sqlobject</artifactId>
            <version>3.38.2</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.zaxxer/HikariCP -->
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.0.1</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.liquibase/liquibase-core -->
        <dependency>
            <groupId>org.liquibase</groupId>
            <artifactId>liquibase-core</artifactId>
            <version>4.22.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.h2database/h2 -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>2.1.214</version>
            <scope>test</scope>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-simple -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>2.0.7</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.15.1</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.webjars.npm/vue -->
        <dependency>
            <groupId>org.webjars.npm</groupId>
            <artifactId>vue</artifactId>
            <version>3.2.38</version>
        </dependency>

        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-test-junit</artifactId>
            <version>${kotlin.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>

        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <executions>
                    <execution>
                        <id>compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>

```

## Modifying _Hello.kt_ into a javalin hello

The generated kotlin project offers a small hello world, lets change it:

```kotlin
package sample.jdbi.javalin

import io.javalin.Javalin

fun main() {
    val app = Javalin.create(/*config*/)
        .get("/") { ctx -> ctx.result("Hello World") }
        .start(7070)
}
```

Run it (try intellij, vscode will demand extra configuration if you like
automatic builds) and see the message on browser. Or in the terminal:

```bash
$ curl http://localhost:7070
# outputs: Hello World
```

## Creating a database

We'll create a system to manage products, clients and orders:

```sql
-- liquibase formatted sql
-- changeset sombriks:2023-05-28-00-00-initial-schema.sql

create table products
(
    id          integer        not null auto_increment primary key,
    description varchar(255)   not null,
    price       decimal(10, 2) not null
);

create table clients
(
    id   integer      not null auto_increment primary key,
    name varchar(255) not null
);

create table orders
(
    id         integer   not null auto_increment primary key,
    clients_id integer   not null,
    creation   timestamp not null default now(),
    foreign key (clients_id) references clients (id)
);

create table orders_products
(
    orders_id       integer not null,
    products_id     integer not null,
    products_amount integer not null default 1,
    primary key (orders_id, products_id),
    foreign key (orders_id) references orders (id),
    foreign key (products_id) references products (id)
);

-- rollback drop table orders_products
-- rollback drop table orders
-- rollback drop table clients
-- rollback drop table products


```

This sql file is already formatted as a
[liquibase changeset in sql format](https://docs.liquibase.com/workflows/liquibase-community/using-rollback.html)
So we can use it in our next step.

## Configuring liquibase, connection pool and jdbi instance

Let's create a kotlin object to proper configure the database when the service
starts:

```kotlin
package sample.jdbi.javalin

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import liquibase.Liquibase
import liquibase.database.jvm.JdbcConnection
import liquibase.resource.ClassLoaderResourceAccessor
import org.jdbi.v3.core.Jdbi
import javax.sql.DataSource

object Config {

    private val dataSource: DataSource by lazy {
        HikariDataSource(HikariConfig("/datasource.properties"))
    }

    val db: Jdbi by lazy {
        Jdbi.create(dataSource)
    }

    fun migrateLatest() {
        val liquibase = Liquibase(
            "/db/changelog/root.xml",
            ClassLoaderResourceAccessor(),
            JdbcConnection(dataSource.connection)
        )
        liquibase.update()
    }

}

```

This config file creates a DataSource and it can be shared by both liquibase and
jdbi. It also features a call to liquibase so we can update the database state.

One important note, `datasource.properties` and `/db/changelog/root.xml` are
classpath resources, don't mistake the "/" at the beginning of the name as
system path.
[We discussed that here already](https://sombriks.com/blog/0051-quick-note-on-java-resources-and-classpath/).

The datasource property file and the root changelog file goes below:

<div class="comparison-box"><div>

More info on datasource properties, see the
[HikariCP documentation](https://github.com/brettwooldridge/HikariCP#gear-configuration-knobs-baby).

```properties
# src/main/resources/datasource.properties

driverClassName=org.h2.Driver
jdbcUrl=jdbc:h2:./sample.db
maximumPoolSize=10
minimumIdle=2
username=sa
password=sa
```

</div><div>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- src/main/resources/db/changelog/root.xml -->
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext"
        xmlns:pro="http://www.liquibase.org/xml/ns/pro"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd
        http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd
        http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd">
    <includeAll path="migrations" relativeToChangelogFile="true"/>
</databaseChangeLog>

```

The `src/main/resources/db/changelog/migrations` folder must contain the sql
script we presented earlier.

</div></div>

## Adding services to use it with jdbi

We're finally in the part we use jdbi. Take `ClientService.kt` as a sample:

```kotlin
package sample.jdbi.javalin.services

import org.jdbi.v3.core.Jdbi
import sample.jdbi.javalin.Config
import sample.jdbi.javalin.models.Client

class ClientService(private val db: Jdbi = Config.db) {

    fun find(id: Int): Client = db.withHandle<Client, Exception> {
        it.createQuery("select * from clients where id = :id")
            .bind("id", id).mapToBean(Client::class.java).one()
    }

    fun list(q: String = ""): List<Client> = db.withHandle<List<Client>, Exception> {
        it.createQuery("select * from clients where name like :name")
            .bind("name", "%$q%").mapToBean(Client::class.java).list()
    }

    fun insert(newClient: Client) {
        db.useHandle<Exception> {
            it.createUpdate("insert into clients (name) values (:name)")
                .bindBean(newClient).execute()
        }
    }

    fun update(client: Client) {
        db.useHandle<Exception> {
            it.createUpdate("update clients set name = :name where id = :id")
                .bindBean(client).execute()
        }
    }

    fun del(id: Int) {
        db.useHandle<Exception> {
            it.createUpdate("delete from clients where id = :id")
                .bind("id", id).execute()
        }
    }
}
```

This is a complete CRUD in less than 50 lines of kotlin WITHOUT using
spring-data or anything like that.

Even if it was plain java, wouldn't be much different. This is why jdbi is
relevant and could be an option on your next, let's say, microservice project.

Access to the entire java ecosystem but without compromise performance and
maintenance.

And to close my point, the _entity_ `Client` has nothing special: it's a plain
kotlin data class which jdbi maps with some reflection:

```kotlin
package sample.jdbi.javalin.models

data class Client(var id: Int?, var name: String)

```

## Defining controllers to wire into javalin routes

Javalin has this [context object](https://javalin.io/documentation#context)
available to each router.

Controllers therefore needs to know how to handle this object.

```kotlin
package sample.jdbi.javalin.controllers

import io.javalin.http.Context
import sample.jdbi.javalin.models.Client
import sample.jdbi.javalin.services.ClientService

class ClientController(private val service: ClientService = ClientService()) {

    fun find(ctx: Context) = ctx.json(service.find(ctx.pathParam("id").toInt()))

    fun list(ctx: Context) = ctx.json(service.list(ctx.queryParam("q") ?: ""))

    fun insert(ctx: Context) = service.insert(ctx.bodyAsClass(Client::class.java))

    fun update(ctx: Context) {
        var id = ctx.pathParam("id").toInt()
        var client = ctx.bodyAsClass(Client::class.java)
        client.id = id
        service.update(client)
    }

    fun del(ctx: Context) = service.del(ctx.pathParam("id").toInt())
}
```

## Design the REST api

A key feature on javalin is the ability to design the entire api in a
centralized way. Of course, this is cool for small api's, but get' harder on
bigger projects.

But again, it's a lightweight framework

Let's change our Hello.kt again:

```kotlin
package sample.jdbi.javalin

import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.*
import sample.jdbi.javalin.controllers.ClientController

fun main() {

    // keeping database sane
    Config.migrateLatest()

    val clientController = ClientController()

    val app = Javalin.create(/*config*/)

    app.get("/") { ctx -> ctx.result("Hello world") }
    app.routes {
        path("clients") {
            get(clientController::list)
            post(clientController::insert)
            path("{id}") {
                get(clientController::find)
                put(clientController::update)
                delete(clientController::del)
            }
        }
        // other paths and controllers here
    }
    app.start(7070)
}
```

No wiring complex object graphs, just initialize the database, instantiate a few
controllers, map routes and we're good to go.

A few more tweaks and that code become way more testable too.

## Adding a small vue gui

The [javalin-vue plugin](https://javalin.io/plugins/javalinvue#how-does-it-work)
does something that, as far as i know, only vue is capable of: progressive
adoption.  

It's not the lightweight [script-tag-only](https://github.com/vuejs/petite-vue)
approach but also isn't the full bundle-aware and
[sfc-ready](https://vuejs.org/guide/scaling-up/sfc.html) tooling, it's something
in between. And boy it's great!.

We'll update our routing again to put some vue screens on our sample:

```kotlin
package sample.jdbi.javalin

import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.*
import io.javalin.vue.VueComponent
import sample.jdbi.javalin.controllers.ClientController

fun main() {

    // keeping database sane
    Config.migrateLatest()

    val clientController = ClientController()

    val app = Javalin.create {
        it.staticFiles.enableWebjars()
        it.vue.vueAppName = "app"
    }

    // render a proper welcome page
    app.get("/", VueComponent("hello-world"))
    app.routes {
        path("clients") {
            get(clientController::list)
            post(clientController::insert)
            path("{id}") {
                get(clientController::find)
                put(clientController::update)
                delete(clientController::del)
            }
        }
    }
    app.start(7070)
}
```

The vue plugin is bundled with javalin, so all we need to do is to configure it
and the java [webjars](https://www.webjars.org/documentation).

Webjars is a way to grab browser dependencies and manage them inside maven.

Once the config is set, we need to create a new structure folder inside the
project resources folder:

```bash
cd src/main/resources
mkdir -p vue/{view,components}
touch vue/layout.html
touch vue/views/hello-world.vue
touch vue/components/client-list.vue
```

And add this as layout content:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="@cdnWebjar/vue/3.2.38/dist/vue.global.js"></script>
    <script>
        const app = Vue.createApp({});
    </script>
    @componentRegistration
</head>
<body>
<main id="main-vue" v-cloak>
    @routeComponent
</main>
<script>
    app.mount("#main-vue")
</script>
</body>
</html>
```

**TIP**: be sure that script file actually exists inside the webjar release,
some releases might call it `vue.min.js`, others will be `vue.global.js`.
These layout releases can change from version to version, so stay alert.

This will be your hello-world.vue:

```html
<template id="hello-world">
  <h1>Hello world</h1>
  <client-list :clients="clients"></client-list>
</template>

<script nonce="@addNonce">
app.component("hello-world", {
  template: "#hello-world",
  data() {
    return {
      clients: []
    }
  },
  async mounted() {
    const result = await fetch("/clients")
    this.clients = await result.json()
  }
})
</script>

<style>
body {
  background-color: antiquewhite;
  color: blue;
}
</style>
```

And the `client-list.vue` component goes as follows:

{% raw %}

```html
<template id="client-list">
  <ul v-if="clients">
    <li v-for="client in clients" :key="client.id">
      {{ client.name }}
    </li>
  </ul>
</template>
<script nonce="@addNonce">
app.component("client-list", {
  template: "#client-list",
  props: ["clients"]
})
</script>
<style>

</style>
```

{% endraw %}

## Final tweaks on project

At this point we got a good sample of what can be done with jdbi, javalin and
vue.

Now let's tweak the project packaging so we don't need to worry about the
project dependencies.

Add the [maven shade plugin](https://maven.apache.org/plugins/maven-shade-plugin/index.html)
to the pom.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>sample.jdbi.javalin</groupId>
    <artifactId>sample-jdbi-javalin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>sample.jdbi.javalin sample-jdbi-javalin</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <kotlin.version>1.8.21</kotlin.version>
        <kotlin.code.style>official</kotlin.code.style>
        <junit.version>4.13.1</junit.version>
    </properties>

    <dependencies>

        <!-- https://mvnrepository.com/artifact/io.javalin/javalin -->
        <dependency>
            <groupId>io.javalin</groupId>
            <artifactId>javalin</artifactId>
            <version>5.5.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.jdbi/jdbi3-kotlin-sqlobject -->
        <dependency>
            <groupId>org.jdbi</groupId>
            <artifactId>jdbi3-kotlin-sqlobject</artifactId>
            <version>3.38.2</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.zaxxer/HikariCP -->
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.0.1</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.liquibase/liquibase-core -->
        <dependency>
            <groupId>org.liquibase</groupId>
            <artifactId>liquibase-core</artifactId>
            <version>4.22.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.h2database/h2 -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>2.1.214</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-simple -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>2.0.7</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.15.1</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.webjars.npm/vue -->
        <dependency>
            <groupId>org.webjars.npm</groupId>
            <artifactId>vue</artifactId>
            <version>3.2.38</version>
        </dependency>

        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-test-junit</artifactId>
            <version>${kotlin.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>

        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.4.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>sample.jdbi.javalin.HelloKt</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <executions>
                    <execution>
                        <id>compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>

```

**TIP**: if you're going to test the jar locally, add another config line for
vue:

```kotlin
    val app = Javalin.create {
        it.staticFiles.enableWebjars()
        it.vue.vueAppName = "app"
        it.vue.isDevFunction = { false }
    }
```

This is only needed if hostname still resolves to localhost.

That way, whenever you run mvn:package, it will produce two jar files:

- `original-sample-jdbi-javalin-1.0-SNAPSHOT.jar`
- `sample-jdbi-javalin-1.0-SNAPSHOT.jar`

The second one is our runnable jar, all-in-one dependencies repackaged.

Easy to run as

```bash
java -jar sample-jdbi-javalin-1.0-SNAPSHOT.jar
```

It has about 20MB in size. For comparison, spring-boot jars starts with 60 MB.

## Further steps

- Improve logging and configure logging noise
- Replace H2 with another database engine, keep for tests
- Add a proper [test suite](https://javalin.io/tutorials/testing)
- Publish it on [lightsail](https://lightsail.aws.amazon.com/ls/webapp/home/instances)
- Make it a configurable Docker image

## Conclusion

As shown, jdbi resolves the problem and doesn't get in your way.
And Javalin is quite handy for fast prototyping and even a minimal frontend to
any experiment or small app.

The complete source code for this article can be found
[here](https://github.com/sombriks/sample-jdbi-javalin).

Happy hacking!

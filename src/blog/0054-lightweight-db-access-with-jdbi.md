---
layout: blog-base.webc
tags:
  - posts
  - kotlin
  - javalin
  - liquibase
  - jdbi
  - sql
  - vue
  - h2
date: 2023-05-27
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

## Configuring liquibase and a connection pool

## Adding services to use it with jdbi

## Design the rest api

## Adding a small vue gui

## Final tweaks on service

## Further steps

- Replace H2 with another database engine
- Publish it on [lightsail](https://lightsail.aws.amazon.com/ls/webapp/home/instances)

## Conclusion

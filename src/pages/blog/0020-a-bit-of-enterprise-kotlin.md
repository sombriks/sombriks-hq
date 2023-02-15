---
layout: base.webc
tags: 
  - posts
  - kotlin
  - gradle
date: 2020-06-03
---
# A bit of Enterprise Kotlin

[Kotlin](https://kotlinlang.org/) is a pretty nice language that runs on top of
the JVM and much more.

The language debuted as the main choice for android development a few years ago
but it didn't stopped there: it features as backend language, desktop and even
web frontend, not limited to jvm anymore.

In this article we'll see how to use kotlin to develop a Enterprise jvm-based
solution (tempted to call it KEE, since people usually call it JEE, but it's
awkward.)

## About JEE

Back in time java enterprise was a hot trend and people where divided between
spring framework and the full featured application servers implementing the Java
Enterprise Specification.

Time passed, spring grow over app server flaws, app servers learned from spring
and now both has your value.

Application servers nowadays still implement a strong concerns separation and
also starts to scale down too (not only up) with the Microprofile specification.

## An enterprise project

We'll divide the project in modules and we'll use gradle as our build system.

```bash
sample-jee-kotlin/
├── build.gradle
├── gradle.properties
├── module-base-model
├── module-business-a
├── module-business-b
├── module-business-c
├── module-web
├── README.md
└── settings.gradle
```

Each module is a gradle sub-project. This is important because each module can
handle specifics of the business without direct impact on other details.

Since it's a multi-project setup, root `build.gradle` is different from regular
gradle script:

```groovy
// parent project just to set general info and repo urls
allprojects {

    repositories {
        jcenter() 
        mavenCentral()
        maven {
          url 'https://maven.java.net/content/repositories/promoted/'
        }
    }

    group 'sample.jee.kotlin'
    version '1.0-SNAPSHOT'
}
```

Each module has a regular gradle project structure:

```bash
module-business-a/
├── build.gradle
└── src
    ├── main
    │   ├── java
    │   ├── kotlin
    │   └── resources
    └── test
        ├── java
        ├── kotlin
        └── resources
```

Notice the kotlin folder.

This `build.gradle` is different:

```groovy
plugins {
  id 'java'
  id 'org.jetbrains.kotlin.jvm' version '1.3.61'
  id 'org.jetbrains.kotlin.plugin.allopen' version '1.3.61'
}

sourceCompatibility = 1.8

dependencies {
  implementation 'org.jetbrains.kotlin:kotlin-stdlib-jdk8'
  testCompile group: 'junit', name: 'junit', version: '4.12'
  // https://mvnrepository.com/artifact/javax/javaee-api
  compileOnly group: 'javax', name: 'javaee-api', version: '8.0.1'

  compile project(':module-base-model')
}

compileKotlin {
  kotlinOptions.jvmTarget = '1.8'
}

compileTestKotlin {
  kotlinOptions.jvmTarget = '1.8'
}

// Kotlin classes are final by default, we need to open them to the JEE magic
allOpen {
  annotations(
    'javax.ejb.Singleton',
    'javax.ejb.Stateful',
    'javax.ejb.Stateless',
    'javax.ejb.Startup',
    'javax.ws.rs.Path'
  )
}
```

Most of it is kotlin language setup.

Also pay attention to the dependencies. We don't specify nothing about which app
server we'll adopt. This is an _agnostic_ or _portable_ enterprise project.

Still about dependencies, since each module is an isolated project, we can list
them as dependencies if needed.

Instead of use on single huge source set, we can manage smaller ones, doing a
better concern separation.

## When old friends meet new comrades

Enterprise Java infrastructure is almost ubiquous by the time of this article
writing since it's huge popularity over past 25 years.

"If it works, don't change it" remains an important rule for mission-critical
solutions, therefore we'll still see java and java ee and spring for a while.

For example this is a traditional JAX-RS java resource:

```java
package sample.jee.resource;

import sample.jee.model.User;
import sample.jee.service.Users;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Stateless
@Path("/user")
@Produces("application/json")
public class UserController {

    @EJB
    private Users users;

    @GET
    public List<User> list() {
      return users.listUsers();
    }
}
```

It's already pretty compact, but look at the kotlin version:

```kotlin
package sample.jee.kotlin.resource

import sample.jee.kotlin.service.Users
import javax.ejb.EJB
import javax.ejb.Stateless
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces

@Stateless
@Path("/user")
@Produces("application/json")
class UserController {

    @EJB
    lateinit var users: Users

    @GET
    fun list() = users.listUsers()
}
```

This is a JPA model mapping in Java:

```java
package sample.jee.kotlin.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="usuario")
public class User {
    @Id
    private Long id;
    private String nome;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String  
}

```

And this is the kotlin version:

```kotlin
package sample.jee.kotlin.model

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name="usuario")
data class User(
    @Id
    var id: Long? = null,
    var nome: String? = null
)
```

Of course, Java 14 has records and soon will allow compact mappings like that.
But kotlin is there now and it's backward-compatible with java 8.

## Migrations subsystem

As told before, the nice part is to use existing java ee infrastructure with
ease on kotlin projects. This is a database migrations bootstrapper using flyway
to manage database schema:

```kotlin
package sample.jee.kotlin.config

import org.flywaydb.core.Flyway
import javax.annotation.PostConstruct
import javax.annotation.Resource
import javax.ejb.Startup
import javax.sql.DataSource

import java.util.logging.Logger
import javax.ejb.Singleton
import javax.ejb.TransactionManagement
import javax.ejb.TransactionManagementType


@Startup
@Singleton
@TransactionManagement(value = TransactionManagementType.BEAN)
class Migrations {

    @Resource(name = "jdbc/sample-ds") lateinit var  ds: DataSource

    val LOG = Logger.getLogger("Migrations")

    @PostConstruct
    fun up() {
        LOG.info("starting migrations subsystem...")
        val flyway = Flyway.configure().dataSource(ds).load()
        flyway.baseline()
        flyway.migrate()
        LOG.info("migrations done!")
    }
}
```

## Not everything is perfect

Right now, if you want a really pleasant developer experience using kotlin with
all the jee stuff you will need intellij ultimate. They created the language, so
they offer the best IDE support right now.

To see the full source code of this article, click
[here](https://github.com/sombriks/sample-jee-kotlin).

---
layout: blog-layout.pug
tags:
  - jbang
  - java
  - kotlin
  - sql
  - jpa
  - jee
  - spring-boot
  - graalvm
  - javalin
  - payara
  - wildfly
  - jdbi
  - h2
  - project structure
  - recipes
  - progressive
  - software architecture
  - sdkman
  - asdf
date: 2026-08-10
draft: false
---
# Big things have small beginnings: taking Java from small to big with JBang

Today we will tour the java jungles using one single, simple, yet powerful, 
_handgun_ called **jbang**, showing that _bazookas_ like maven or gradle are a 
choice, not a necessity.

But what is [jbang][jbang]?

[jbang]: https://jbang.dev

Well, imagine that you want to _hello world_.

All you need is a compiler/interpreter and some knowledge of the language. But 
what if you want a _database hello world_, or _json-serialization hello world_?

Unless the library for those already is present, either you write the code for 
it yourself, from scratch, or you do as most modern languages/platforms 
usually offers: a huge ready to use online library, just download and boom, 
bullseye.

In [Java][java], most people would say to you something like _it's dangerous_ 
_to go alone, take this!_, then then hand over to you a bunch of folders, a 
cabalistic [xml][xml] file and explain that this is how java goes to look like 
for now on.

[java]: https://dev.java
[xml]: https://wiki.c2.com/?XmlSucks

Well, this is how bureaucracy starts to enter in your veins. Now java is 
clumsy, verbose, even slow, useless without all those devices to keep it alive. 
But by wielding this large machinery, one can serve millions, go full 
enterprise, to de moon, and -- no.

Java doesn't need to be that way, either too naive or too complex.

This is where **JBang** enters and shows that, not only the
[Gordian Knot][gknot] is easier to untie than expected, but the entire power of 
this entire ecosystem can be tamed with less effort and bureaucracy.

[gknot]: https://www.youtube.com/watch?v=cpKwBbz1sf0

But don't take my word, let's see what is possible to really do with it.

## Installation

Several options:

### SDKMan!

First, [install sdkman](https://sdkman.io/)

```bash
sdk install jbang
```

### asdf

First, [install asdf](https://asdf-vm.com/guide/getting-started.html)

```bash
asdf plugin-add jbang
asdf install jbang latest
asdf global jbang latest
```

You can also check a list of alternative methods to get it in the
[project site][s].

[s]: https://www.jbang.dev/documentation/jbang/latest/installation.html

### Bash completon

Add the following line at the end of your `.bashrc`:

```bash
# JBang
. <(jbang completion)
export PATH=$PATH:$HOME/.jbang/bin
```

## How to _hello world_ 

### Direct eval

Make jbang eval java code directly from the command line:

```bash
jbang run -c "System.out.println(\"Hello World\");"
```

### Create a simple script

Use jbang to initialize a simple script

```bash
jbang init Hello.java
```

The generated file goes like this:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+

void main(String... args) {
    IO.println("Hello World");
}
```

If you need a specific java version, pass the version as parameter in the init 
command:

```bash
jbang init --java=8 Hello.java
```

Then the Generated source file goes like this:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 8

import static java.lang.System.*;

public class Hello {

    public static void main(String... args) {
        out.println("Hello World");
    }
}
```

### Running

Call the entry script:

```bash
jbang Hello.java
```

One cool thing is that jbang downloads a suitable jdk based on what you 
provides in the `//JAVA <version>` comment in the script.

Those comments are relevant, as we'll see over the samples. 

### Other exotic entry points

JBang also supports jshell scripts and markdown files as entry points, but 
let's not cover those modes here. Just check the [official docs][1] if you want 
to do some exotic things.

[1]: https://www.jbang.dev/documentation/jbang/latest/multiple-languages.html


## Dependency management

So far, jbang is a neat toy, but any simple java project nowadays must be able 
to consume maven dependencies or some sort of external library registry.

It can do that too!

### Creating a script with dependencies

To init a script with dependencies:

```bash
jbang init --deps=com.esotericsoftware:minlog:1.3.1 Hello.java
```

The script will look like this:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS com.esotericsoftware:minlog:1.3.1

// i modified the script a little to make use of the dependency
import com.esotericsoftware.minlog.Log;

void main(String... args) {
    // IO.println("Hello World");
    Log.info("This is a tiny log message.");    
}
```

Run it:

```Bash
sombriks@erebus 03 $ jbang Hello.java
[jbang] Resolving dependencies...
[jbang]    com.esotericsoftware:minlog:1.3.1
[jbang] Dependencies resolved
[jbang] Building jar for Hello.java...
00:00  INFO: This is a tiny log message.
sombriks@erebus 03 $
```

Now we're talking.

### Add more dependencies

In order to add more dependencies, either provide a comma-separated list of 
maven coordinates (or [GAV][2] as jbang refers to them), during the init 
command or add them by hand in the script:

[2]: https://share.google/aimode/M2HvPaalwwxjcEBwD

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS com.esotericsoftware:minlog:1.3.1
//DEPS com.google.code.gson:gson:2.11.0

import com.esotericsoftware.minlog.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;

record Todo(String description, boolean done){}

void main(String... args) {
    Log.info("This is a tiny log message.");

    var list = new ArrayList();
    list.add(new Todo("Do the dishes",true));
    list.add(new Todo("Walk the dog",false));

    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    String jsonOutput = gson.toJson(list);
    Log.info(jsonOutput);
}
```

## Resources

Resources are useful for configurations, templates and all sort of blobs you 
application migh need to consume in order to do the jobs.

In jbang, resources are pretty straightforward. For example:

```bash
touch users.xml
touch User.java
rouch log4j2.xml
jbang init --deps \
tools.jackson.dataformat:jackson-dataformat-xml:3.0.3,\
org.apache.logging.log4j:log4j-api:2.26.1,\
org.apache.logging.log4j:log4j-core:2.26.1 \
Build.java
```

Users xml would be like this:

```xml
<Users>
    <user id="1" name="Alice"/>
    <user id="2" name="Bobb"/>
</Users>
```

In Buyild.jva, we'll use the `//SOURCES` comment for the extra java sources and 
the `//FILES` for the resource files: 

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//COMPILE_OPTIONS -parameters
//DEPS tools.jackson.dataformat:jackson-dataformat-xml:3.0.3
//DEPS org.apache.logging.log4j:log4j-api:2.26.1
//DEPS org.apache.logging.log4j:log4j-core:2.26.1
//SOURCES User.java
//FILES log4j2.xml
//FILES users.xml

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import tools.jackson.dataformat.xml.XmlMapper;
import tools.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import tools.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import java.util.ArrayList;

 record Users(
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "user")
    ArrayList<User> user){}

public class Build {

    private static final Logger LOG = LogManager.getLogger(Build.class);

    public static void main(String... args) throws Exception {
        LOG.info("Hello World");
        var mapper = XmlMapper.builder().build();
        var users = mapper.readValue(Build.class
        .getResourceAsStream("users.xml"), Users.class);
        LOG.info(users);
    }
}
```

The `//COMPILE_OPTIONS` is just to make jackson behave. More on that later. 

Both in `//FILES` and `//SOURCES` it's possible to indicate a list of
comma-separated file or folders with wildcards. (i.e. src/main/java/**/*.java).

## Project layout

Unlike maven, jbang is not opinionated regarding how you should organize your 
project.

But that doesn't mean that everything should be inside one single java source.

This is not the case.

For example, for those who comes from a maven or gradle culture, the following 
setup is more that familiar:

```bash
mkdir -p src/main/{java,resources}
mkdir -p src/main/java/foo/bar/{configs,controllers,services,models}
touch src/main/java/foo/bar/TodoApp.java
touch src/main/java/foo/bar/configs/TodoCfg.java
touch src/main/java/foo/bar/controllers/TodoCtl.java
touch src/main/java/foo/bar/services/TodoSvc.java
touch src/main/java/foo/bar/models/Todo.java
touch src/main/resources/application.properties
jbang init --deps \
io.vertx:vertx-core:4.5.7,\
io.vertx:vertx-web:4.5.7,\
io.vertx:vertx-jdbc-client:4.5.7,\
io.agroal:agroal-pool:2.5,\
com.h2database:h2:2.2.224 \
Build.java
```

Next, add the `//SOURCES` and `//FILES` comment configurations in `Build.java`:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS io.vertx:vertx-core:4.5.7
//DEPS io.vertx:vertx-web:4.5.7
//DEPS io.vertx:vertx-jdbc-client:4.5.7
//DEPS io.agroal:agroal-pool:2.5
//DEPS com.h2database:h2:2.2.224

//SOURCES src/main/java/**/*
//FILES src/main/resources/

void main(String... args) {
    // simply pass the args to the application entry point
    foo.bar.TodoApp.main(args);
}
```

The `TodoApp` class has no knowledge about how the project is built:

```java
package foo.bar;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.jdbcclient.JDBCPool;

import foo.bar.configs.TodoCfg;
import foo.bar.controllers.TodoCtl;
import foo.bar.services.TodoSvc;

public class TodoApp {
    public static void main(String...args) throws Exception {

        Vertx vertx = Vertx.vertx();

        var cfg = new TodoCfg(vertx);
        var pool = cfg.configurePool();
        var todoSvc = new TodoSvc(pool);
        var todoCtl = new TodoCtl(todoSvc);

        Router router = Router.router(vertx);
        router.get("/todos").handler(todoCtl::list);
        router.post("/todos").handler(todoCtl::insert);

        todoSvc.init().onSuccess(_ -> {
            vertx.createHttpServer()
                .requestHandler(router)
                .listen(cfg.getServerPort());
        });
    }
}
```

### A lower entry barrier

This sample aims to demonstrate how far jbang can take the project. It is 
possible to start with a simple, humble configuration and grow from that. This 
is a long lost skill in java ecosystem that i am glad to see it coming back in 
such elegant way.

In fact, The build system, with dependency resolution capabilities and other 
neat features should be native in the jdk itself.

## Testing like a pro

So far we can build simple scripts, add resources, build complex 
infrastructures. 

But does it do what it is supposed to do?

To answer this, the answer is to add tests to the jbang project.

### Basic setup

Initialize the project as usual:

```bash
mkdir -p src/{main,test}/{java,resources}
mkdir -p src/{main,test}/java/xpto/baz
mkdir -p src/main/resources/META-INF
touch src/main/java/xpto/baz/{Main,TodoList,TodoItem}.java
touch src/main/resources/META-INF/persistence.xml
touch src/test/resources/init-test.sql
touch src/test/java/xpto/baz/MainTest.java
jbang init --deps \
org.hibernate.orm:hibernate-core:6.5.2.Final,\
com.h2database:h2:2.2.224 \
Build.java
```

In jbang entry point, configure the folder structure and call the actual main 
class:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS org.eclipse.persistence:eclipselink:4.0.2
//DEPS com.h2database:h2:2.2.224
//SOURCES src/main/java/**/*
//FILES src/main/resources/

void main(String... args) throws Exception {
    xpto.baz.Main.main(args);
}
```

The example is pretty straightforward, a simple JPA use case:

```java
package xpto.baz;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.util.List;

public class Main {

    private final EntityManagerFactory emf = Persistence //
            .createEntityManagerFactory("default");

    public List<TodoList> list() {
        try (EntityManager em = emf.createEntityManager()) {
            return em.createQuery("""
                    select t from TodoList t
                    """, TodoList.class).getResultList();
        }
    }

    public TodoList add(String list, String task) {
        try (EntityManager em = emf.createEntityManager()) {
            em.getTransaction().begin();
            TodoList todoList = new TodoList(list);
            TodoItem todoItem = new TodoItem(todoList, task);
            em.persist(todoList);
            em.persist(todoItem);
            em.flush();
            em.clear();
            em.getTransaction().commit();
            todoList.getItems().add(todoItem);
            return todoList;
        }
    }

    public void close() {
        emf.close();
    }

    public static void main(String... args) throws Exception {
        var app = new Main();
        app.add("today", "walk the dog");
        List<TodoList> result = app.list();
        result.forEach(IO::println);
        app.close();
    }
}
```

### How to test

Nothing new so far, so, how to call a test runner in a jbang Scenario? Worth 
 mentioning, how to keep the runtime classpath clean from test dependencies?

Easiest way: **Add a Test entrypoint**:

```bash
jbang init --deps \
org.junit.jupiter:junit-jupiter:5.11.0,\
org.junit.platform:junit-platform-launcher:1.11.0,\
org.hamcrest:hamcrest:3.0 \
Test.java
```

In the class `Test.java`, add the _Build.java_ main jbang entry point as 
a `//SOURCES` dependency, along with instructions to configure the test 
classpath and the code to execute the tests  and print the test summary:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS org.junit.jupiter:junit-jupiter:5.11.0
//DEPS org.junit.platform:junit-platform-launcher:1.11.0
//DEPS org.hamcrest:hamcrest:3.0
//SOURCES Build.java
//SOURCES src/test/java/**/*
//FILES src/test/resources/

import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.engine.discovery.DiscoverySelectors;

void main(String... args) throws Exception {
    LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder
        .request()
        .selectors(DiscoverySelectors
            .selectPackage("xpto.baz")) // put your tests under this package
        .build();

    SummaryGeneratingListener listener = new SummaryGeneratingListener();

    try (LauncherSession session = LauncherFactory.openSession()) {
        Launcher launcher = session.getLauncher();
        launcher.registerTestExecutionListeners(listener);
        launcher.execute(request);
    }

    var summary = listener.getSummary();
    summary.printFailuresTo(new PrintWriter(System.err), 1);
    summary.printTo(new PrintWriter(System.out));

    System.exit(summary.getTestsFailedCount() > 0 ? 1 : 0);
}
```

And the tests are pretty standard java tests:

```java
package xpto.baz;

import org.junit.jupiter.api.Test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

class MainTest {

    final Main main = new Main();

    @Test
    void shouldCreateTodo() {
        var result = main.add("today", "doomscrolling");
        assertThat(result, is(not(nullValue())));
        assertThat(result.getId(), notNullValue());
        assertThat(result.getId(), greaterThan(0L));
    }
}
```

### What about coverage

If a test serves to the purpose of confidently assert that the software should 
work, the coverage describes **how much code** should be working.

In any big boy project the minimum coverage lies about 80%, but this isn't a 
general rule. What is for sure is that covered code should not produce 
surprises. If it does, there is a flaky test.

The most popular coverage tool for java is [jacoco][jacoco].

[jacoco]: https://www.eclemma.org/jacoco/

To add it into our setup, add the dependency and create a extra coverage 
function to the test script:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS org.junit.jupiter:junit-jupiter:5.11.0
//DEPS org.junit.platform:junit-platform-launcher:1.11.0
//DEPS org.hamcrest:hamcrest:3.0
//DEPS org.jacoco:org.jacoco.core:0.8.13
//SOURCES Build.java
//SOURCES src/test/java/**/*
//FILES src/test/resources/

import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.engine.discovery.DiscoverySelectors;

import org.jacoco.core.runtime.IRuntime;
import org.jacoco.core.runtime.LoggerRuntime;
import org.jacoco.core.runtime.RuntimeData;
import org.jacoco.core.data.ExecutionDataStore;
import org.jacoco.core.data.SessionInfoStore;
import org.jacoco.core.analysis.Analyzer;
import org.jacoco.core.analysis.CoverageBuilder;
import org.jacoco.core.analysis.IClassCoverage;
import org.jacoco.core.analysis.ICounter;

import java.io.File;
import java.io.PrintWriter;
import java.io.IOException;

void main(String... args) throws Exception {
    IRuntime runtime = new LoggerRuntime();
    RuntimeData data = new RuntimeData();
    runtime.startup(data);

    LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder
        .request()
        .selectors(DiscoverySelectors.selectPackage("xpto.baz"))
        .build();

    SummaryGeneratingListener listener = new SummaryGeneratingListener();

    try (LauncherSession session = LauncherFactory.openSession()) {
        Launcher launcher = session.getLauncher();
        launcher.registerTestExecutionListeners(listener);
        launcher.execute(request);
    } finally {
        runtime.shutdown();
    }

    var summary = listener.getSummary();
    summary.printFailuresTo(new PrintWriter(System.err), 1);
    summary.printTo(new PrintWriter(System.out));

    coverage(data);

    System.exit(summary.getTestsFailedCount() > 0 ? 1 : 0);
}

void coverage(RuntimeData data) throws IOException {
    ExecutionDataStore executionData = new ExecutionDataStore();
    SessionInfoStore sessionInfo = new SessionInfoStore();
    data.collect(executionData, sessionInfo, false);

    CoverageBuilder coverageBuilder = new CoverageBuilder();
    // Agora passamos a estrutura correta (executionData) para o Analyzer
    Analyzer analyzer = new Analyzer(executionData, coverageBuilder);

    String classpath = System.getProperty("java.class.path");
    for (String path : classpath.split(File.pathSeparator)) {
        File file = new File(path);
        if (file.isFile()
            && file.getName().endsWith(".jar")
            && file.getAbsolutePath().contains(".jbang")) {
            analyzer.analyzeAll(file);
        }
    }

    System.out.println("\n=== (JACOCO COVERAGE) ===");
    System.out.printf("%-40s %-10s %-10s %-10s\n",//
        "Class", "Covered", "Total", "% Coverage");
    System.out.println("-".repeat(75));

    int totalLines = 0;
    int coveredLines = 0;

    for (IClassCoverage classCoverage : coverageBuilder.getClasses()) {
        if (classCoverage.getName().endsWith("Test")
            || classCoverage.getName().equals("Test")
            || classCoverage.getName().equals("Build")) {
            continue;
        }

        ICounter lineCounter = classCoverage.getLineCounter();
        int total = lineCounter.getTotalCount();
        int covered = lineCounter.getCoveredCount();
        double pct = total > 0 ? ((double) covered / total) * 100 : 0.0;
        String name = classCoverage.getName().replace('/', '.');

        System.out.printf("%-40s %-10d %-10d %-9.1f%%\n",//
            name, covered, total, pct);

        totalLines += total;
        coveredLines += covered;
    }

    System.out.println("-".repeat(75));
    double pct = totalLines > 0
        ? ((double) coveredLines / totalLines) * 100
        : 0.0;
    System.out.printf("%-40s %-10d %-10d %-9.1f%%\n", //
        "TOTAL", coveredLines, totalLines, pct);
    System.out.println("=".repeat(75));
}
```

That way both test and coverage reports will be provided to the project.

### It's getting complex

Well, yes, but it comes in incremental steps.

jbang also offers an export tool, if you feel that the project should be 
managed in a more old-fashioned way, using gradle ofr maven.

## Templates

You don't need always build jbang projects from scratch. It supports 
[temaplates][temaplates].

[temaplates]: https://www.jbang.dev/documentation/jbang/latest/templates.html

To create a jbang script using a template goes like this:

```bash
jbang init --template=cli Hello.java
```

Then you can test the command line interface lie this:

```bash
jbsng Hello.java
```

## Packaging the project

Once your project is done, it't time to package it.

JBang offers a couple of ways to do that.

### Export a project

Once you're done with scripting, you can export the script as a full-featured 
traditional maven or gradle project:

```bash
jbang init -t cli Hello.java
jbang export maven Hello.java
```

That creates a `Hello` folder with a maven project inside.

### Export a (fat) jar

If everything is done and all you need is to spit out the packaged project:

```bash
jbang export portable Hello.java
```

This produces a jar and a lib folder, with all dependencies needed to run the 
app.

To avoid the inconvenience of carrying the lib folder around, export a single, 
all-inclusive jar file:

```bash
jbang export fatjar Hello.java
```

#### What is inside

In both cases, jar and lib folder and _fatjar_, the following command can 
describe what's actually inside the package:

```bash
jar tvf $(jbang info jar Hello.java)
```

### Install as a local app

JBang also allows you to install a project as a local application.

First make sure that your terminal is properly set up:

```bash
jbang app setup
```

You can also add something like this in your .bashrc:

```bash
# JBang
. <(jbang completion)
export PATH=$PATH:$HOME/.jbang/bin
```

Now we're good to go:

```bash
jbang app install --name hellojbang Hello.java
```

Test it:

```bash
hellojbang
```

Congratulations, you just installed a command line tool.

Check the [docs][docs] for more interesting ways to export and use scripts 
regarding package and distribution.

[docs]: https://www.jbang.dev/documentation/jbang/latest/app-installation.html

## What about Kotlin

It's been a long time since the jvm became a true multi-language platform. One 
iof the nicest options is ~~jythopn~~ ~~jruby~~ ~~clojure~~ ~~groovy~~ 
~~scala~~ ~~javascript~~ kotlin.

### Entry point

At the moment, there is no `jbang init Build.kt`. So, create the script 
yourself:

```kotlin
///usr/bin/env jbang "$0" "$@" ; exit $?
// let's call it App.kt
//KOTLIN 2.4.10

fun main(args: Array<String>) {
    println("Hello ${args.firstOrNull() ?: "World"}")
}
```

Run it goes as expected:

```bash
jbang App.kt
```

All the rest goes as expected. just add the dependencies, some code and run it:

```kotlin
///usr/bin/env jbang "$0" "$@" ; exit $?
// let's call it App.kt
//JAVA 25+
//KOTLIN 2.4.10
//COMPILE_OPTIONS -jvm-target=25
//SOURCES *.kt
//DEPS io.javalin:javalin:7.2.2
//DEPS org.slf4j:slf4j-simple:2.0.16
//DEPS com.fasterxml.jackson.module:jackson-module-kotlin:2.17.2
//DEPS org.jetbrains.exposed:exposed-core:1.0.0
//DEPS org.jetbrains.exposed:exposed-jdbc:1.0.0
//DEPS com.h2database:h2:2.2.224

import io.javalin.Javalin

fun main(args: Array<String>) {

    AppCfg.database()
    val svc = TodoSvc()
    val ctl = TodoCtl(svc)
    val app = Javalin.create {
        AppCfg.cors(it)
        AppCfg.api(ctl, it.routes)
    }
    svc.init()
    app.start(7070)
}
```

The `//COMPILE_OPTIONS` is added to make sure that the bytecode generated by 
the kotlin compiler is compatible with the dependencies.

## Going enterprise

Anyone aware of the JEE history would giggle a little just by thinking running 
those overly complex, full of xml configurations, ear/war java applications 
from a simple command line script.

Then [Spring Boot][boot] emerged and ate the market.

[boot]: https://spring.io/projects/spring-boot

But after the shock, over the years, [Jakarta EE][jee] applications fought 
complexity while kept a consistent API. 

The spec is beautiful.

### The (portable) application

The application is a simple, honest, JSON api:

```bash
mkdir -p src/app/{controllers,models,repositories,services}
touch src/app/App.java
touch src/app/controllers/TodoRes.java
touch src/app/models/Todo.java
touch src/app/repositories/TodoRepo.java
touch src/app/services/TodoSvc.java
mkdir src/META-INF
touch src/META-INF/{beans,persistence}.xml
```

And the implementation  goes by the book:

```java
// App.java
package app;

import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.ApplicationPath;

@ApplicationPath("api")
public class App extends Application {}

```
---
```java
// TodoRes.java
package app.controllers;

import app.models.Todo;
import app.services.TodoSvc;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("todos")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TodoRes {

    @Inject
    private TodoSvc service;

    @GET
    public List<Todo> list() {
        return service.listarTodas();
    }

    @POST
    public Todo create(Todo todo) {
        return service.salvar(todo);
    }
}

```

All other classes goes with those well-known JEE annotations.

The `persistence.xml` is also tweaked to rely only on portable properties:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<persistence version="3.0"
             xmlns="https://jakarta.ee"
             xmlns:xsi="http://w3.org"
             xsi:schemaLocation="https://jakarta.ee
             https://jakarta.ee/persistence_3_0.xsd">
    <persistence-unit name="default" transaction-type="JTA">
        <class>app.models.Todo</class>
        <properties>
            <property name="jakarta.persistence.jdbc.driver"
                      value="com.h2database.Driver"/>
            <property name="jakarta.persistence.jdbc.url"
                      value="jdbc:h2:mem:tododb;DB_CLOSE_DELAY=-1;MODE=LEGACY"/>
            <property name="jakarta.persistence.jdbc.user" value="sa"/>
            <property name="jakarta.persistence.jdbc.password" value=""/>
            <property
                name="jakarta.persistence.schema-generation.database.action"
                value="create"/>
        </properties>
    </persistence-unit>
</persistence>
```

The `beans.xml` is an empty file.

### Building the portable JEE artifact

Unlike everything we saw so far, we don't run the application straightforward.

Instead, we build a [war][war] file to be deployed into a jee server.

[war]: https://tinyurl.com/47a6za3x

First, init the `Portable.java` source to compile the classes for us:

```bash
jbang init --java=21 --deps \
jakarta.platform:jakarta.jakartaee-web-api:10.0.0 \
Portable.java
```

The `--java=21` flag matters due to some incompatibilities that some jee 
servers has with java 25, used on all examples until now.

The `Portable.java` entry point looks like this:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//DEPS jakarta.platform:jakarta.jakartaee-web-api:10.0.0
//JAVA 21
//FILES META-INF/persistence.xml=src/META-INF/persistence.xml
//FILES META-INF/beans.xml=src/META-INF/beans.xml
//SOURCES src/**/*.java

public class Portable {
    public static void main(String... args) {
        System.out.println("Hello World");
    }
}

```

Just _one_ single `//DEPS` on the web profile jee specification. 

Now we're good to go ahead and generate the jar:

```bash
jbang export portable --force Portable.java
```

#### The war format

Now it's time to perform a small convoluted step and smash the jar and create 
a war file:

```bash
mkdir -p ROOT/WEB-INF/classes
unzip ./Portable.jar -d ROOT/WEB-INF/classes/
cd ROOT
rm -f WEB-INF/classes/Portable.class
jar -cvfM ../ROOT.war *
cd ..
rm -rf ROOT
```

Now our artifact is ready to get deployed on any _modern JEE AppServer_.

### Getting a JEE compatible app server

Now we need to find a server compatible with this application. This step should 
be easy.

### Payara

We ca use jbang with no major issues to run our artifact:

```bash
jbang --java=21 \
fish.payara.extras:payara-micro:7.2026.2 \
--port 8080 \
--deploy ROOT.war
```

### Wildfly Glow

For wildfly, just one extra step to generate a true portable jar file:

```bash
jbang org.wildfly.glow:wildfly-glow:1.4.0.Final \
scan ROOT.war \
--provision=BOOTABLE_JAR \
--add-ons=h2-database:default
java -jar ROOT-41.0.0.Final-bootable.jar
```

### The state of JEE in the age of microservices

JEE barely passes this test, to be honest. The feeling that we're seeing a huge 
elephant riding a child-sized bicycle remains.

This is not an overall issue, just in this use case, where i am scaling from 
nothing to any arbitrary project size and structure using just jbang. And the 
fact that two of may JEE server i tried to run actually worked is a kind of 
good sign.

The spec goes in its own pace, it's open and keeps evolving.

## Going enterprise, this time with more feeling

There are some fun facts about spring. For example:

The creator of spring framework started it as a book to point out the marvels 
of java enterprise edition. So, spring started as documentation first. Also, he 
started do disbelieve jee the more he studied it. Too convoluted, unnecessarily 
complex. It's a [fun story][documentary].

[documentary]: https://www.youtube.com/watch?v=4qTwA6Y1-OI

### Basic setup

The simplest setup goes like this:

```bash
jbang init --deps \
org.liquibase:liquibase-core:5.0.3,\
org.springframework.boot:spring-boot-starter-web:4.1.0,\
org.springframework.boot:spring-boot-starter-data-jpa:4.1.0,\
org.springframework.boot:spring-boot-starter-liquibase:4.1.0,\
org.springframework.boot:spring-boot-starter-test:4.1.0,\
org.junit.platform:junit-platform-launcher:6.1.2,\
org.hamcrest:hamcrest:3.0,\
com.h2database:h2:2.3.232 \
HelloSpring.java
mkdir -p src/app/{controllers,models,repositories,services}
mkdir -p resources/changelogs/2026/08/09
touch src/app/{App,AppTest}.java
touch src/app/controllers/TodoCtl.java
touch src/app/models/Todo.java
touch src/app/repositories/TodoRepo.java
touch src/app/services/TodoSvc.java
touch resources/{application,application-test}.yml
touch resources/changelogs/root-changelog.yml
touch resources/changelogs/2026/08/09/{1-create-database,2-test-data}.sql
```

This is a non-trivial _hello world_ with spring and database migrations with 
[liquibase][liquibase]. Scaffolded in a single (long) command line!

[liquibase]: https://docs.liquibase.com/

### Our entry point

As usual, the main jbang script acts more as a dependency management than 
proper code, except for the code needed to run the tests:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS org.liquibase:liquibase-core:5.0.3
//DEPS org.springframework.boot:spring-boot-starter-web:4.1.0
//DEPS org.springframework.boot:spring-boot-starter-data-jpa:4.1.0
//DEPS org.springframework.boot:spring-boot-starter-liquibase:4.1.0
//DEPS org.springframework.boot:spring-boot-starter-test:4.1.0
//DEPS org.junit.platform:junit-platform-launcher:6.1.2
//DEPS org.hamcrest:hamcrest:3.0
//DEPS com.h2database:h2:2.3.232
//SOURCES src/**/*.java
//FILES resources

import app.App;

import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherSession;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.engine.discovery.DiscoverySelectors;

import java.io.PrintWriter;

void main(String... args) {
    if (args.length > 0 && "test".equals(args[0])) {
        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder
            .request()
            .selectors(DiscoverySelectors.selectPackage("app"))
            .build();

        SummaryGeneratingListener listener = new SummaryGeneratingListener();

        try (LauncherSession session = LauncherFactory.openSession()) {
            Launcher launcher = session.getLauncher();
            launcher.registerTestExecutionListeners(listener);
            launcher.execute(request);
        }

        var summary = listener.getSummary();
        summary.printFailuresTo(new PrintWriter(System.err), 1);
        summary.printTo(new PrintWriter(System.out));

        System.exit(summary.getTestsFailedCount() > 0 ? 1 : 0);
    } else {
        App.main(args);
    }
}
```

The test itself need no knowledge of jbang or anything but spring:

```java
package app;

import app.models.Todo;
import app.services.TodoSvc;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@ActiveProfiles("test")
public class AppTest {

    @Autowired
    private TodoSvc todoSvc;

    @Test
    public void deveBuscarDadosIniciaisDoLiquibaseViaService() {
        List<Todo> todos = todoSvc.listarTodos();
        assertThat(todos, is(notNullValue()));
        assertThat(todos.size(), is(greaterThanOrEqualTo(2)));

        String primeiroTitulo = todos.get(0).getTitulo();
        assertThat(primeiroTitulo, containsString("Estudar JBang"));
    }
}
```

### Exporting

Export the project as a portable and things will work standalone:

```bash
jbang export portable HelloSpring.java
java -jar HelloSpring.jar
```

This approach, however, expects the lib folder next to the jar. Keep that in 
mind.

For the **fatjar** approach, follow these steps:

```bash
# under construction
```

### The state of thing regarding jbang for serious spring projects

This is a marriage mad in heaven.

Spring scales up and down as good as jbang does and don't suffer from the rigid 
standarization that classic jee suffers.

Ir simply works.

## Going native with JBang

This is a huge trend over the entire industry. _Go native_. There are benefits, 
of course, but they don't diminish the good parts of what java ecosystem 
delivers normally.

In fact, most java projects need special care to get properly transformed into 
native images, but i'll not discuss that here.

Anyway, jbang delivers a nice experience for those attempting to produce native 
things, as long as your environment is configured right.

### Enter GraalVM

Use our friend [sdkman][sdk] to get the native guns:

[sdk]: https://sdkman.io

```bash
sdk install java 25.2.4-graalce
```

Test the native powers this way:

```bash
rm Native Native.java
jbang init Native.java
jbang export native Native.java
./Native
```

### A more complete example

Consider this setup for a first-class microservice in java:

```bash 
jbang init --deps \
io.javalin:javalin:7.2.2,\
org.jdbi:jdbi3-core:3.54.0,\
com.fasterxml.jackson.core:jackson-databind:2.22.1,\
org.slf4j:slf4j-simple:2.0.13,\
com.h2database:h2:2.2.224,\
Build.java
mkdir -p src/main/{java,resources}
mkdir -p src/main/java/app/todos
mkdir -p src/main/resources/META-INF/native-image
touch src/main/java/app/App.java
touch src/main/java/app/todos/Todo{Ctl,Svc,Mdl}.java
touch src/main/resources/application.properties
touch src/main/resources/META-INF/native-image/resource-config.json
touch src/main/resources/META-INF/native-image/reflect-config.json
```

The Build.java goes as usual:

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 25+
//DEPS io.javalin:javalin:7.2.2
//DEPS org.jdbi:jdbi3-core:3.54.0
//DEPS com.fasterxml.jackson.core:jackson-databind:2.22.1
//DEPS org.slf4j:slf4j-simple:2.0.13
//DEPS com.h2database:h2:2.2.224
//SOURCES src/main/java
//FILES src/main/resources

void main(String... args) throws Exception {
    app.App.main(args);
}
```

The App looks like this:

```java
package app;

import app.todos.TodoCtl;
import app.todos.TodoSvc;
import io.javalin.Javalin;

import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.path;
import static io.javalin.apibuilder.ApiBuilder.post;

public class App {
    public static void main(String... args) throws Exception {
        TodoSvc svc = new TodoSvc();
        TodoCtl ctl = new TodoCtl(svc);
        svc.init();
        Javalin.create(c -> {
                    c.routes.apiBuilder(() -> {
                        path("todos", () -> {
                            get(ctl::list);
                            post(ctl::create);
                        });
                    });
                })
                .start(7000);
    }
}
```

You get the idea. Run as usual:

```bash
jbang Build.java
```

### The bundle config

Although javalin does its best to avoid reflection, which is a weak point on 
java native images, some dependencies need external resources, mostly 
locales, to work properly. 

But the native image generation strips out those resources from the final 
binary and, because of that, we end up with nasty runtime errors.

To avoid this, the special configuration,
`META-INF/native-image/resource-config.json` defines every runtime bundle 
that will be needed:

```json
{
  "bundles": [
    {
      "name": "jakarta.servlet.LocalStrings"
    },
    {
      "name": "jakarta.servlet.http.LocalStrings"
    }
  ],
  "resources": {
    "includes": [
      {
        "pattern": "application\\.properties"
      },
      {
        "pattern": "\\Qapplication.properties\\E"
      }
    ]
  }
}
```

### Why people avoid reflection in Native images

Another issue is reflection. If you really need reflection, it mjust be 
_authorized_ in `META-INF/native-image/reflect-config.json`:

```json
[
  {
    "name": "org.h2.Driver",
    "allPublicMethods": true,
    "allDeclaredConstructors": true
  },
  {
    "name": "app.todos.TodoMdl",
    "allPublicMethods": true,
    "allDeclaredConstructors": true
  }
]
```

Imagine that, reflection became illegal in java!

Anyway, that's it, we're good to go ahead and create a native image from this 
code using jbang:

```bash
rm -rf lib Build Build.jar Build-fatjar.jar
jbang cache clear
jbang export native Build.java
```

### Is it worth the trouble?

So, what do we get for our troubles?

```bash
jbang export portable Build.java
# ...
java -jar Build.jar
# ...
[main] INFO io.javalin.Javalin - Javalin started in 314ms \o/
```

Meanwhile, the native image:

```bash
./Build
# ...
[main] INFO io.javalin.Javalin - Javalin started in 64ms \o/
```

And even better startup times are possible.

One drawback are the compilation times. They make regular java builds look 
like a regular, interactive interpreter.

But boy it runs fast! 

## Conclusion

Alright, we did it, am homeric tour of several different places of java 
ecosystem. From hello world to the native images, passing by the old civilation 
of jee, the _collective delirium_ of reactive programming, the modern 
enterprise java with spring boot, a lot of places.

And if you ask me, it went well, we did it. And all we needed was jbang.

To be honest, some samples where discarded because the technology was 
specifically designed to work properly only with maven or gradle, or due to 
reflection being illegal in (native) java, imagine that!

But most first-class, high-quality frameworks, ran smoothly with jbang because, 
in the end, all those libes need to run is java. 

And boy, jbang serves java with elegance and _class_.

I didn't covered _everythig_. I didn't even covered properly the tings 
presented here.

But my case is made, the gun is loaded and ready to (j)bang.

Happy hacking!

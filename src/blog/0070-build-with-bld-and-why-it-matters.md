---
layout: blog.pug
tags:
  - posts
  - java
  - bld
  - maven
  - gradle
  - sdkman
  - rife2
  - htmx
  - spring
  - build tools
  - github actions
  - project setup
  - project structure
  - project management
date: 2024-05-05
draft: false
---
# Build with bld and why it matters to the jvm ecosystem

In [previous][previous1] [articles][previous2] we discussed how to structure a
java project and like [this guide here][previous3] we started naive and grew in
complexity more and more.

But complexity is bad, it tends to just add up.

In this article we'll discuss a new tool, which uses both the state of the art
and a very pragmatic way of thinking when it comes to the problem of manage a
java/jvm project.

My friends, let's talk about [bld][bld].

## What is bld anyway?

I was lurking in the internet when i hit this [Adam Bien][abien]'s
[podcast episode][airhacks] and got hooked: so that small command he was using
wasn't a custom, personal, script to relieve the pain. It was a dedicated tool.

Curiosity grew and i decided to try it. Now here we are, writing advice for me,
for new java adopters and for other old, seasoned and weary java architects out
there.

In very short words, bld create and manage jvm-based projects.

The key difference, for example, from [maven][maven], it uses
**java language itself** to manage the project construction and dependencies.

That puts bld closer to what [gradle][gradle] does, but unlike this one, bld is
simpler, focused on the goal of just build things up and build it right.

What? how does it compares to [ant][ant]?

Compared with ant, bld is simple and does more. Both has 3 letters.

### How good is it?

Well, so far the single evidence that bld is cool and good is my word. so let't
take a closer look:

### Installation

For any of those tools mentioned here, there is a tool to help install them and
it's called [sdkman][sdkman].

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

Once it's installed, proceed to install bld:

```bash
sdk install bld
```

Check if things are fine by simply calling bld:

```bash
bld
Welcome to bld 1.9.0.

The bld CLI provides its features through a series of commands that
perform specific tasks. The help command provides more information about
the other commands.

Usage: help [command]

The following commands are supported.

  create        Creates a new project from multiple choice
  create-app    Creates a new Java application project
  create-base   Creates a new Java baseline project
  create-lib    Creates a new Java library project
  create-rife2  Creates a new RIFE2 web application project
  help          Provides help about any of the other commands
  upgrade       Upgrades the bld wrapper to the latest version
  version       Outputs the version of the build system

  -?, -h, --help    Shows this help message
  -D<name>=<value>  Set a JVM system property
  -s, --stacktrace  Print out the stacktrace for exceptions
```

### Notes on project creation

Create your project with:

```bash
bld create-app foo.bar app
```

And thats it. Get it?

If you're not shocked, see what is needed to achieve almost the same with maven:

```bash
mvn archetype:generate -DinteractiveMode=false \
                       -DgroupId=foo.bar \
                       -DartifactId=app \
                       -DarchetypeGroupId=org.apache.maven.archetypes \
                       -DarchetypeArtifactId=maven-archetype-quickstart \
                       -DarchetypeVersion=1.4
```

And this is what it takes to do the same on gradle:

```bash
gradle init \
  --type java-application \
  --dsl kotlin \
  --test-framework junit-jupiter \
  --package foo.bar \
  --project-name app  \
  --no-split-project  \
  --java-version 17
```

One may argue that although those are two _very hideous_ command lines, it's not
that important since we're not doing it so often.

On the other hand, this is how you create a go project nowadays:

```bash
mkdir app ; cd app; go mod init foo.bar/app
```

And this is the creation of a javascript project:

```bash
mkdir app ; cd app; npm init -y
```

The ability to create simple, fast and discardable projects without much effort
tends to make us do it more, experiment more. That characteristic alone makes
bld worthy enough to be taken seriously.

But how is it managing a project?

## Simple hello world

Once created, you will find a very pragmatic structure:

- The standard java project folder layout (`src/{main,test}/{java,resources}`)
- A wrapper script (`./bld` and `./bld.bat` available)
- One configuration file, get this, located under `src/bld/java`.
- A `lib` folder to keep all your dependencies
- Handy configuration files for your favorite IDEs

Take [this sample project][sample-bld] as an example:

```bash
tree sample-htmx-rife2 -a
sample-htmx-rife2/
├── bld
├── bld.bat
├── .git
├── .github
│   └── workflows
│       └── bld.yml
├── .gitignore
├── .idea
│   ├── app.iml
│   ├── bld.iml
│   ├── dataSources
│   ├── dataSources.local.xml
│   ├── dataSources.xml
│   ├── .gitignore
│   ├── libraries
│   │   ├── bld.xml
│   │   ├── compile.xml
│   │   ├── runtime.xml
│   │   ├── standalone.xml
│   │   └── test.xml
│   ├── misc.xml
│   ├── modules.xml
│   ├── runConfigurations
│   │   ├── Run Main.xml
│   │   └── Run Tests.xml
│   ├── vcs.xml
│   └── workspace.xml
├── lib
│   └── bld
│       ├── bld-wrapper.jar
│       ├── bld-wrapper.properties
│       └── bld-wrapper.properties.hash
├── LICENSE
├── README.md
├── src
│   ├── bld
│   │   └── java
│   │       └── sample
│   │           └── htmx
│   │               └── TodoappBuild.java
│   ├── main
│   │   ├── java
│   │   │   └── sample
│   │   │       └── htmx
│   │   │           ├── elements
│   │   │           │   ├── DeleteTodoElement.java
│   │   │           │   ├── FindTodoElement.java
│   │   │           │   ├── IndexElement.java
│   │   │           │   ├── InsertTodoElement.java
│   │   │           │   ├── ListTodoElement.java
│   │   │           │   ├── processor
│   │   │           │   │   └── TemplateProcessor.java
│   │   │           │   └── UpdateTodoElement.java
│   │   │           ├── model
│   │   │           │   └── Todo.java
│   │   │           ├── service
│   │   │           │   └── TodoService.java
│   │   │           ├── TodoappSite.java
│   │   │           └── TodoappSiteUber.java
│   │   ├── resources
│   │   │   ├── simplelogger.properties
│   │   │   └── templates
│   │   │       ├── index.html
│   │   │       └── todos
│   │   │           ├── detail.html
│   │   │           ├── form.html
│   │   │           └── list.html
│   │   └── webapp
│   │       ├── css
│   │       │   └── style.css
│   │       ├── htmx-2.0.0-beta3.min.js
│   │       └── WEB-INF
│   │           └── web.xml
│   └── test
│       └── java
│           └── sample
│               └── htmx
│                   └── TodoappTest.java
└── .vscode
    ├── launch.json
    └── settings.json
```

Notice the `.idea` and the `.vscode` directories. You got those for free, but in
the future the IDEs might detect that it's a bld project. I want to believe.

This is what you get when you run the wrapper script:

```bash
$ ./bld
Welcome to bld 1.9.0.

The bld CLI provides its features through a series of commands that
perform specific tasks. The help command provides more information about
the other commands.

Usage: help [command]

The following commands are supported.

  clean            Cleans the build files
  compile          Compiles the project
  dependency-tree  Outputs the dependency tree of the project
  download         Downloads all dependencies of the project
  help             Provides help about any of the other commands
  jar              Creates a jar archive for the project
  jar-javadoc      Creates a javadoc jar archive for the project
  jar-sources      Creates a sources jar archive for the project
  javadoc          Generates javadoc for the project
  precompile       Pre-compiles RIFE2 templates to class files
  publish          Publishes the artifacts of your web project
  publish-local    Publishes to the local maven repository
  purge            Purges all unused artifacts from the project
  run              Runs the project (take option)
  test             Tests the project with JUnit (takes options)
  uberjar          Creates an UberJar archive for the project
  updates          Checks for updates of the project dependencies
  version          Outputs the version of the build system
  war              Creates a war archive for the project

  -?, -h, --help    Shows this help message
  -D<name>=<value>  Set a JVM system property
  -s, --stacktrace  Print out the stacktrace for exceptions
```

IDE will help, but it's nice to have everything you need presented like that,
upfront, ready to hit the road.

The sample project uses [rife2][rife2] and [htmx][htmx]. It is part of
[an][javalin] [ongoing][spring] [experiment][chi] [involving][fiber]
[htmx][koa]. You can see [other articles][0069] [about it][0068] [later][0067].

The ergonomics of such way to manage the java project are closer to what we get
on node or go. Ask anyone who dealt with projects involving those languages and
you will get positive feedback.

### A look into the build file

As mentioned before, bld uses java to configure a java projet. this is what it
looks like:

```java
package sample.htmx;

import rife.bld.WebProject;

import java.util.List;

import static rife.bld.dependencies.Repository.*;
import static rife.bld.dependencies.Scope.*;
import static rife.bld.operations.TemplateType.*;

public class TodoappBuild extends WebProject {

    public TodoappBuild() {
        pkg = "sample.htmx";
        name = "Todoapp";
        mainClass = "sample.htmx.TodoappSite";
        uberJarMainClass = "sample.htmx.TodoappSiteUber";
        version = version(0, 1, 0);

        downloadSources = true;
        repositories = List.of(MAVEN_CENTRAL, RIFE2_RELEASES);
        scope(compile)
                .include(dependency("com.uwyn.rife2:rife2:1.7.3"))
                .include(dependency("org.slf4j:slf4j-simple:2.0.13"));
        scope(provided);
        scope(test)
                .include(dependency("org.jsoup:jsoup:1.17.2"))
                .include(dependency("org.junit.jupiter:junit-jupiter:5.10.2"))
                .include(dependency("org.junit.platform:junit-platform-console-standalone:1.10.2"));
        scope(standalone)
                .include(dependency("org.eclipse.jetty.ee10:jetty-ee10-servlet:12.0.8"))
                .include(dependency("org.eclipse.jetty.ee10:jetty-ee10:12.0.8"))
                .include(dependency("com.h2database:h2:2.2.224"));

        precompileOperation()
                .templateTypes(HTML);
    }

    public static void main(String[] args) {
        new TodoappBuild().start(args);
    }
}
```

Now tat's something.

Since we're talking about modern, enterprise java, there is no escape from
[maven central][mvncentral]. But it's still more benefitial than troublesome, so
we still have to declare [maven coordinates][mvncoordinates] correctly.

Pretty much like maven and gradle, you can put [scopes][mvnscopes] on your
dependencies, making things available in classpath depending on the context.

And of course you declare your own coordinates in this class as well, since bld
is [fully capable of publish packages too][bld-publish].

## But does it really shine?

Short answer: YES.

Long one: let's take a look at [this spring boot project][spring].

I've added bld, maven and gradle as build systems to it.

This is the `pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
 <modelVersion>4.0.0</modelVersion>
 <parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.2.5</version>
  <relativePath/> <!-- lookup parent from repository -->
 </parent>
 <groupId>sample.htmx</groupId>
 <artifactId>sample-htmx-spring</artifactId>
 <version>0.0.1-SNAPSHOT</version>
 <name>sample-htmx-spring</name>
 <description>Demo project for HTMX with Spring Boot / Thymeleaf</description>
 <properties>
  <java.version>17</java.version>
 </properties>
 <dependencies>
  <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>
  <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-webflux</artifactId>
  </dependency>
  <dependency>
   <groupId>org.liquibase</groupId>
   <artifactId>liquibase-core</artifactId>
  </dependency>
  <dependency>
   <groupId>org.webjars.npm</groupId>
   <artifactId>htmx.org</artifactId>
   <version>1.9.12</version>
  </dependency>

  <dependency>
   <groupId>com.h2database</groupId>
   <artifactId>h2</artifactId>
   <scope>runtime</scope>
  </dependency>
  <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-test</artifactId>
   <scope>test</scope>
  </dependency>
  <dependency>
   <groupId>io.projectreactor</groupId>
   <artifactId>reactor-test</artifactId>
   <scope>test</scope>
  </dependency>
  <dependency>
   <groupId>org.hamcrest</groupId>
   <artifactId>hamcrest</artifactId>
   <scope>test</scope>
   <version>2.2</version>
  </dependency>
 </dependencies>

 <build>
  <plugins>
   <plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
   </plugin>
  </plugins>
 </build>

</project>
```

A reminder of XML isn't meant to be read by people but by parsers.

The gradle counterpart, the `build.gradle` file, looks like this:

```groovy
plugins {
 id 'java'
 id 'org.springframework.boot' version '3.2.5'
 id 'io.spring.dependency-management' version '1.1.4'
}

group = 'sample.htmx'
version = '0.0.1-SNAPSHOT'

java {
 sourceCompatibility = '17'
}

repositories {
 mavenCentral()
}

dependencies {
 implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
 implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
 implementation 'org.springframework.boot:spring-boot-starter-webflux'
 implementation 'org.liquibase:liquibase-core'
 implementation 'org.webjars.npm:htmx.org:1.9.12'

 testImplementation 'org.springframework.boot:spring-boot-starter-test'
 testImplementation 'io.projectreactor:reactor-test'
 testImplementation 'org.hamcrest:hamcrest:2.2'

 runtimeOnly 'com.h2database:h2'
}

tasks.named('test') {
 useJUnitPlatform()
}
```

Better to read, since programming languages are meant to be easy to the
programmer's eyes.

Then gradle parses it, spawns a daemon and performs several internal operations
in order to compile your classes.

And this is our bld build class, from
`src/bld/java/sample/htmx/spring/SampleHtmxSpringBuild.java`:

```java
package sample.htmx.spring;

import rife.bld.BuildCommand;
import rife.bld.WebProject;
import rife.bld.extension.BootJarOperation;

import java.util.List;

import static rife.bld.dependencies.Repository.*;
import static rife.bld.dependencies.Scope.*;
import static rife.bld.operations.TemplateType.*;

public class SampleHtmxSpringBuild extends WebProject {

    public SampleHtmxSpringBuild() {

        pkg = "sample.htmx.spring";
        name = "SampleHtmxSpring";
        mainClass = "sample.htmx.spring.SampleHtmxSpringApplication";
        version = version(0, 0, 1, "SNAPSHOT");

        downloadSources = true;
        repositories = List.of(MAVEN_CENTRAL, RIFE2_RELEASES);

        scope(compile)
                .include(dependency("org.springframework.boot:spring-boot-starter-data-jpa:3.2.5"))
                .include(dependency("org.springframework.boot:spring-boot-starter-thymeleaf:3.2.5"))
                .include(dependency("org.springframework.boot:spring-boot-starter-webflux:3.2.5"))
                .include(dependency("org.webjars.npm:htmx.org:1.9.12"))
                .include(dependency("org.liquibase:liquibase-core:4.24.0"));

        scope(test)
                .include(dependency("org.junit.platform:junit-platform-console-standalone:1.10.2"))
                .include(dependency("org.springframework.boot:spring-boot-starter-test:3.2.5"))
                .include(dependency("io.projectreactor:reactor-test:3.6.5"))
                .include(dependency("org.hamcrest:hamcrest:2.2"));

        scope(standalone)
                .include(dependency("org.springframework.boot:spring-boot-loader:3.2.5"))
                .include(dependency("com.h2database:h2:2.2.224"));
    }

    @BuildCommand(summary = "Creates an executable JAR for the project")
    public void bootJar() throws Exception {
        new BootJarOperation()
                .fromProject(this)
                .execute();
    }

    public static void main(String[] args) {
        new SampleHtmxSpringBuild().start(args);
    }
}
```

We can argue that although groovy is cleaner, the developer is already wired in
java syntax, so there is a smaller cognitive overhead.

And this is definitively easier to read than the maven's pom.xml.

Needless to say, all three build options in this sample are able to build a
regular spring boot project.

### Continuous integration

One last but not least important note: You can put `bld` to work for you on your
continuous integration pipeline, just as you would do with maven or gradle. The
[sample project][spring] has [three][ci-bld] [github][ci-gradle]
[workflows][ci-maven] sampling how to use each of them.

The bld and maven are usually the fastest ones, gradle tries to spawn a daemon
even in ci mode and it slows it down.

A quick note on bld workflow:

{% raw %}

```yml
---
name: Java CI with bld
on:
  push:
    branches: [ "*" ]
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - uses: actions/cache@v4
        with:
          path: lib
          key: bld-${{ hashFiles('src/bld/java/**') }}
        id: cache
      - if: steps.cache.outputs.cache-hit != 'true'
        run: ./bld clean download
      - run: ./bld compile test
```

{% endraw %}

In order to keep it fast, you must tweak the build process by using the
[cache action][action-cache]. Maven and gradle actions uses cache too, so add it
to your `bld` workflow as well.

## Conclusion (or Why it matters)

For a long time, java, while language and platform, was stuck into a position
lacking innovation and offering little developer ergonomics.

The recent years however where different: More frequent releases, decent LTS
support, new features being added and as consequence new adopters, new tools and
new ideas.

It is important and quite a feat to remain stable and very backwards compatible,
but embrace the new and deliver good developer experience, like other stacks do,
that keeps the jvm and its ecosystem as not only a safe choice, but also an
exciting, joyful one.

You usually get nice results, nice products from happy, excited people.

And boy bld is for sure exciting, node and golang people can't mock me anymore!

Thanks for reading, happy hacking, bye bye!

[previous1]: 0036-how-to-structure-a-java-project
[previous2]: 0057-how-to-structure-a-java-project-part-2
[previous3]: https://github.com/sombriks/enterprise-kotlin-handbook
[bld]: https://rife2.com/bld
[abien]: https://www.youtube.com/@bienadam
[airhacks]: https://adambien.blog/roller/abien/entry/no_dependencies_or_how_rife
[maven]: https://maven.apache.org/
[gradle]: https://gradle.org/
[ant]: https://ant.apache.org/
[sdkman]: https://sdkman.io/install
[sample-bld]: https://github.com/sombriks/sample-htmx-rife2
[rife2]: https://rife2.com/
[htmx]: https://htmx.org
[0069]: 0069-htmx-and-go-benchmark
[0068]: 0068-benchmark-with-k6
[0067]: 0067-you-should-try-htmx
[javalin]: https://github.com/sombriks/sample-htmx-javalin
[spring]: https://github.com/sombriks/sample-htmx-spring
[chi]: https://github.com/sombriks/sample-htmx-chi
[fiber]: https://github.com/sombriks/my-golang-handbook/tree/main/exercises/0015-rest-htmx
[koa]: https://github.com/sombriks/sample-htmx-koa
[mvncentral]: https://central.sonatype.com/
[mvncoordinates]: https://maven.apache.org/pom.html#Maven_Coordinates
[mvnscopes]: https://blogs.oracle.com/developers/post/mastering-maven-dependency-basics
[bld-publish]: https://github.com/rife2/bld/wiki/Publishing
[ci-bld]: https://github.com/sombriks/sample-htmx-spring/blob/main/.github/workflows/bld.yml
[ci-gradle]: https://github.com/sombriks/sample-htmx-spring/blob/main/.github/workflows/gradle.yml
[ci-maven]: https://github.com/sombriks/sample-htmx-spring/blob/main/.github/workflows/maven.yml
[action-cache]: https://github.com/marketplace/actions/cache

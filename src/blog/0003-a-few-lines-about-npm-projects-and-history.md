---
layout: blog-base.webc
tags:
    - posts 
    - package managers
    - long rant
date: 2017-12-06
---

# Words about package registries, build tools, past, present and future

You see, when i got into this train it already was on move. Internet. Databases.
Servers. Clients.

All the stuff we still have nowadays.

But back in 2007, i didn't had the slightest idea, for example, what a public
registry would be.

When i needed to setup a java project, i used to start creating the eclipse
project, then downloading every dependency. One by one.

And then i found [maven](https://en.wikipedia.org/wiki/Apache_Maven).

The idea itself wasn't
new. [Debian's apt-get](<https://en.wikipedia.org/wiki/APT_(Debian>) already did
something similar for years.

Even yet, due to my [slackware](http://www.slackware.com/) background, i used to
have a little resistance against apt-like tools.

Also maven was just horrible.

There where a xml-based config. It forced an entire new project folder layout.
The fancy IDE's had zero integration or, when there was, looked much like a
liver transplant that went bad.

But yet!

Maven was huge, disruptive change. The core and most important part of it wasn't
the build process, but the [package registry](http://central.maven.org/maven2/).
There are [online tools](https://mvnrepository.com/) just to help the _regular
java boi_ find the right package for the right project.

[Gradle](https://gradle.org/) dudes got this and their tool is quite compatible
with maven central.

Enter [npm](http://npmjs.com/) era.

npm not only is useful from command line, but also have a nice package registry.
600k+ by the time of this article. maven central had 640k+. Of course, there are
a few others maven-like registries, but this sample is enough to give you the
general idea.

The important part about having a good project tool and a healthy and wealthy
package registry is how your project will take advantage of it.

Remember, not only you, but your team must be able to handle configuration
issues.

We'll now compare maven, gradle and npm regarding a few aspects: initial setup,
managing dependencies... This sort of things.

## Creating the project

Let's say that i want to create **my-awesome-project-tm**. (I'll assume we at
least have created a folder with this name already)

Using maven, all i need to do is:

```bash
mvn -B archetype:generate -DarchetypeGroupId=org.apache.maven.archetypes -DgroupId=br.com.sombriks -DartifactId=my-awesome-project-tm
```

What a lovely command line!

In fact, i suspect that everyone just copy a pom.xml from somewhere and start
from there. Remember, when maven came, much java programmers where stuck on
IDE's, some still are.

Can gradle do better?

Assuming you have gradle on your command line:

```bash
gradle init
```

And a few seconds later, bam! **build.gradle gradle gradlew gradlew.bat
settings.gradle**

See, for example, the generated **build.gradle:**

```groovy
/*
 * This build file was auto generated by running the Gradle 'init' task
 * by 'sombriks' at '05/12/17 16:36' with Gradle 3.2
 *
 * This generated file contains a commented-out sample Java project to get you started.
 * For more details take a look at the Java Quickstart chapter in the Gradle
 * user guide available at https://docs.gradle.org/3.2/userguide/tutorial_java_projects.html
 */

/*
// Apply the java plugin to add support for Java
apply plugin: 'java'

// In this section you declare where to find the dependencies of your project
repositories {
    // Use 'jcenter' for resolving your dependencies.
    // You can declare any Maven/Ivy/file repository here.
    jcenter()
}

// In this section you declare the dependencies for your production and test code
dependencies {
    // The production code uses the SLF4J logging API at compile time
    compile 'org.slf4j:slf4j-api:1.7.21'

    // Declare the dependency for your favourite test framework you want to use in your tests.
    // TestNG is also supported by the Gradle Test task. Just change the
    // testCompile dependency to testCompile 'org.testng:testng:6.8.1' and add
    // 'test.useTestNG()' to your build script.
    testCompile 'junit:junit:4.12'
}
*/
```

To be honest it's almost usable. You still have to set up code and stuff. but
it's a better and less cryptic start compared with maven.

And in the npm land we have to do that:

```bash
npm init -y
```

It will output a single file called **package.json** with this content:

```json
{
  "name": "my-awesome-project-tm",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

It's said that _the greatest sophistication is the simplicity_.
To be fair, the three command line init options have nearly the same difficult
if you get some novice crewmen.
But npm options will look far more easier for the ones who already know maven or
gradle.
Still a beautiful illusion.

## Adding some dependencies

On maven/gradle land, you add dependencies copying and pasting them directly
inside the project file is the de-facto standard.

let's say we need [Processing](https://processing.org/) into our maven awesome
project. all we need to do is to open pom.xml and add the dependency:

```xml

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>br.com.sombriks</groupId>
    <artifactId>my-awesome-project-tm</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>my-awesome-project-tm</name>
    <url>http://maven.apache.org</url>
    <dependencies>
        <dependency>
            <groupId>org.processing</groupId>
            <artifactId>java-mode</artifactId>
            <version>3.3.6</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>3.8.1</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>

```

On gradle realm we would have something like this:

```groovy
apply plugin: 'java'

repositories {
    jcenter()
}

dependencies {
    compile 'org.slf4j:slf4j-api:1.7.21'
    testCompile 'junit:junit:4.12'

    compile 'org.processing:java-mode:3.3.6'
}
```

And a similar operation in the javascript realm would look pretty much like
this:

```bash
npm install processing-js --save
```

It will modify the **package.json** file for you:

```json
{
  "name": "my-awesome-project-tm",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "processing-js": "^1.6.6"
  }
}
```

Once you add a dependency and/or call for a build, maven, gradle and npm will
download it for you.

Unlike the java cousins, npm will download it locally.

A folder called **node_modules** will appear once you start to add dependencies
for the registry.

Maven and gradle will store them in an folder called .m2 in side your home
directory.

## Packaging

Maven and Gradle will worry about how you plan to package your project. Will it
be a .jar file? a .war? .ear? who knows?

But npm however have no business with that.

In fact, if you publish your npm project to the registry, lit will carry the
layout you make.

## Some kind of conclusion. It's late

Those tools carry many differences. Gradle where meant to be a better Maven, but
NPM serves us well... on another platform.

We didn't debated here Ruby gems, PHP composer or pip. Yet thinking again about
2007, we lived without these tools.

My my, we had a sad life.

---
layout: blog-base.webc
tags:
  - posts
  - java
  - jar
  - ant
  - maven
  - gradle
  - project setup
  - project structure
date: 2023-10-01
draft: false
---

# How to structure a java project part 2

In the [previous article](/blog/0036-how-to-structure-a-java-project) we
presented a bare-bones working process for those who didn't want to deal with
the complexity of huge, modern, complex and bloated java environments.

In this article we'll start to introduce some real-world complexity to the
scenario and see how things evolve.

## Why java projects structure are the way they are? How that disaster happened?

Well, let's visit our
[sample project](https://github.com/sombriks/how-to-structure-java-projects)
and add one external dependency:

```bash
04-managing-dependencies
├── bin
├── lib
│   └── gson-2.10.1.jar
├── messages.json
├── src
│   ├── Grievous.java
│   ├── HelloThere.java
│   ├── Item.java
│   ├── META-INF
│   │   └── MANIFEST.MF
│   └── Quotes.java
└── target
```

Because we now have to deal with one external jar file, our bare hands build
command expands to something like this:

```bash
cd 04-managing-dependencies
javac -d bin -cp bin src/Item.java
javac -d bin -cp bin src/Quotes.java
javac -d bin -cp bin:lib/gson-2.10.1.jar src/Grievous.java
javac -d bin -cp bin src/HelloThere.java
jar cvfm target/star-wars-2.jar src/META-INF/MANIFEST.MF -C bin .
cp lib/gson-2.10.1.jar target/gson-2.10.1.jar
java -jar target/star-wars-2.jar
```

One might say let's just create a bash script to compile our thing, but it's
also possible to say that's too much for too little benefit.

Imagine if we grow to use 10 or 100 dependencies!

The more classes you reate, the more libraries you consume, for sure your
program will be capable of wonderful things. Yet the simple task of build it
grows too troublesome, too fast.

Maybe it's not a java thing, or at least an exclusive one. but it exists and
inspired the creation of project management tools like...

## Apache Ant

It means _Another Neat Tool_ but no one remembers it. Just the ants. It was the
first attempt of [Apache Foundation](https://www.apache.org/) to tackle the
issue of big and complex java projects, and it was very successful in its time.

Anecdotal legends says that they created [ant](https://ant.apache.org/) because
java programmers where incapable of read or create
[Makefiles](https://www.gnu.org/software/make/manual/make.html).

Every ant-managed project has a file called `build.xml` and this file defines
**targets**.

Those targets can depend on each other in order to complete the **tasks**
defined within them:

```xml
<project name="05-ant-project" default="dist" basedir=".">
    <description>
        ant-managed project
    </description>
    <target name="init">
        <mkdir dir="target"/>
        <mkdir dir="bin"/>
    </target>
    <target name="build" depends="init">
        <javac srcdir="src" destdir="bin">
            <classpath>
                <fileset dir="lib">
                    <include name="*.jar"/>
                </fileset>
                <pathelement path="bin"/>
            </classpath>
        </javac>
    </target>
    <target name="dist" depends="build">
        <jar basedir="bin" jarfile="target/star-wars-3.jar" manifest="src/META-INF/MANIFEST.MF"/>
        <copy file="lib/gson-2.10.1.jar" tofile="target/gson-2.10.1.jar"/>
    </target>
    <target name="clean">
        <delete dir="bin"/>
        <delete dir="target"/>
    </target>
</project>
```

Now our command collection to proper run this project is reduced to this:

```bash
cd 05-ant-project
ant -v
java -jar target/star-wars-3.jar
```

This is the expected output for those commands:

```bash
[sombriks@lucien how-to-structure-java-projects]$ cd 05-ant-project
[sombriks@lucien 05-ant-project]$ ant -v
Apache Ant(TM) version 1.10.13 compiled on January 4 2023
Trying the default build file: build.xml
Buildfile: /home/sombriks/git/how-to-structure-java-projects/05-ant-project/build.xml
Detected Java version: 17 in: /usr/lib/jvm/java-17-openjdk-17.0.8.0.7-1.fc38.x86_64
Detected OS: Linux
parsing buildfile /home/sombriks/git/how-to-structure-java-projects/05-ant-project/build.xml with URI = file:/home/sombriks/git/how-to-structure-java-projects/05-ant-project/build.xml
Project base dir set to: /home/sombriks/git/how-to-structure-java-projects/05-ant-project
parsing buildfile jar:file:/home/sombriks/.sdkman/candidates/ant/current/lib/ant.jar!/org/apache/tools/ant/antlib.xml with URI = jar:file:/home/sombriks/.sdkman/candidates/ant/current/lib/ant.jar!/org/apache/tools/ant/antlib.xml from a zip file
Build sequence for target(s) `dist' is [init, build, dist]
Complete build sequence is [init, build, dist, clean, ]

init:
    [mkdir] Created dir: /home/sombriks/git/how-to-structure-java-projects/05-ant-project/target
    [mkdir] Created dir: /home/sombriks/git/how-to-structure-java-projects/05-ant-project/bin

build:
    [javac] /home/sombriks/git/how-to-structure-java-projects/05-ant-project/build.xml:10: warning: 'includeantruntime' was not set, defaulting to build.sysclasspath=last; set to false for repeatable builds
    [javac] Grievous.java added as Grievous.class doesn't exist.
    [javac] HelloThere.java added as HelloThere.class doesn't exist.
    [javac] Item.java added as Item.class doesn't exist.
    [javac] /home/sombriks/git/how-to-structure-java-projects/05-ant-project/src/META-INF/MANIFEST.MF skipped - don't know how to handle it
    [javac] Quotes.java added as Quotes.class doesn't exist.
    [javac] Compiling 4 source files to /home/sombriks/git/how-to-structure-java-projects/05-ant-project/bin
    [javac] Using modern compiler
    [javac] Compilation arguments:
    [javac] '-d'
    [javac] '/home/sombriks/git/how-to-structure-java-projects/05-ant-project/bin'
    [javac] '-classpath'
    [javac] '/home/sombriks/git/how-to-structure-java-projects/05-ant-project/bin:/home/sombriks/git/how-to-structure-java-projects/05-ant-project/lib/gson-2.10.1.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-launcher.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-antlr.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-apache-bcel.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-apache-bsf.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-apache-log4j.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-apache-oro.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-apache-regexp.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-apache-resolver.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-apache-xalan2.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-commons-logging.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-commons-net.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-imageio.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-jai.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-jakartamail.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-javamail.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-jdepend.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-jmf.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-jsch.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-junit.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-junit4.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-junitlauncher.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-netrexx.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-swing.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-testutil.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant-xz.jar:/home/sombriks/.sdkman/candidates/ant/current/lib/ant.jar'
    [javac] '-sourcepath'
    [javac] '/home/sombriks/git/how-to-structure-java-projects/05-ant-project/src'
    [javac] '-g:none'
    [javac] 
    [javac] The ' characters around the executable and arguments are
    [javac] not part of the command.
    [javac] Files to be compiled:
    [javac]     /home/sombriks/git/how-to-structure-java-projects/05-ant-project/src/Grievous.java
    [javac]     /home/sombriks/git/how-to-structure-java-projects/05-ant-project/src/HelloThere.java
    [javac]     /home/sombriks/git/how-to-structure-java-projects/05-ant-project/src/Item.java
    [javac]     /home/sombriks/git/how-to-structure-java-projects/05-ant-project/src/Quotes.java

dist:
      [jar] Building jar: /home/sombriks/git/how-to-structure-java-projects/05-ant-project/target/star-wars-3.jar
      [jar] adding directory META-INF/
      [jar] adding entry META-INF/MANIFEST.MF
      [jar] adding entry Grievous.class
      [jar] adding entry HelloThere.class
      [jar] adding entry Item.class
      [jar] adding entry Quotes.class
      [jar] No Implementation-Title set.No Implementation-Version set.No Implementation-Vendor set.
      [jar] Location: /home/sombriks/git/how-to-structure-java-projects/05-ant-project/build.xml:20: 
     [copy] Copying 1 file to /home/sombriks/git/how-to-structure-java-projects/05-ant-project/target
     [copy] Copying /home/sombriks/git/how-to-structure-java-projects/05-ant-project/lib/gson-2.10.1.jar to /home/sombriks/git/how-to-structure-java-projects/05-ant-project/target/gson-2.10.1.jar

BUILD SUCCESSFUL
Total time: 0 seconds
[sombriks@lucien 05-ant-project]$ java -jar target/star-wars-3.jar
Item[message=General Kenobi!!]
Item[message=We're doomed!]
Item[message=I have a bad feeling about that...]
Item[message=Use the force, Luke.]
[sombriks@lucien 05-ant-project]$ 
```

Some highlights:

- Ant is very imperative. You have targets and they have tasks.
- It solves most issues with plain commands, but also helps to surface others:
  the versions and compatibilities between dependencies.

One extra degree of indirection opens path to another...

## Apache Maven

[Maven](https://maven.apache.org) moves away from imperative solutions to build
and manage Java projects and proposes a more declarative approach.

Instead of targets depending on each other and tasks to be performed, it has
**goals**. It already knows how to build and package a project and, through its
plugins, it knows more goals. It knows how to get external dependencies for you.
It needs internet to work properly. It takes control.

You can create a new maven project like this:

```bash
mvn archetype:generate -DinteractiveMode=false \
                       -DgroupId=sample.structure \
                       -DartifactId=06-maven-project \
                       -DarchetypeGroupId=org.apache.maven.archetypes \
                       -DarchetypeArtifactId=maven-archetype-quickstart \
                       -DarchetypeVersion=1.4
```

It delivers a project structure more or less like this:

```bash
06-maven-project
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── sample
    │           └── structure
    │               └── App.java
    └── test
        └── java
            └── sample
                └── structure
                    └── AppTest.java
```

Back in 2009 it was a bold move to force this folder structure into the poor
java developer, it still is nowadays. But it sticks and no sign that it will be
gone soon.

The `pom.xml` file takes care of all needed coordinates to resolve external
dependencies, it's scopes (another issue surfaced by complex projects) and
transitive dependencies (yes... your dependencies might have dependencies as
well). it also knows how to package the project.

The initially generated pom can be cleaned up to this:

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>sample.structure</groupId>
  <artifactId>06-maven-project</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>06-maven-project</name>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.google.code.gson</groupId>
      <artifactId>gson</artifactId>
      <version>2.10.1</version>
    </dependency>

    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-engine</artifactId>
      <version>5.9.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

</project>
```

As you can see, not a single line about where the code is or how to compile it.
Everything, besides some configuration details, became convention.

Even jar file naming.

The build and run command for maven projects became more or less like this:

```bash
cd 06-maven-project
mvn clean package
# yikes,
java -cp ~/.m2/repository/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar:target/06-maven-project-1.0-SNAPSHOT.jar sample.structure.HelloThere
```

You can make use of a maven plugin to avoid such horrific command line.

Modify your pom.xml and add the [exec plugin](https://www.mojohaus.org/exec-maven-plugin/java-mojo.html):

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>sample.structure</groupId>
  <artifactId>06-maven-project</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>06-maven-project</name>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>com.google.code.gson</groupId>
      <artifactId>gson</artifactId>
      <version>2.10.1</version>
    </dependency>

    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-engine</artifactId>
      <version>5.9.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>3.1.0</version>
        <executions>
          <execution>
            <goals>
              <goal>java</goal>
            </goals>
          </execution>
        </executions>
        <configuration>
          <mainClass>sample.structure.HelloThere</mainClass>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

The output is something like this:

```bash
[sombriks@lucien 06-maven-project]$ mvn clean package exec:java
[INFO] Scanning for projects...
[INFO] 
[INFO] -----------------< sample.structure:06-maven-project >------------------
[INFO] Building 06-maven-project 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- clean:3.2.0:clean (default-clean) @ 06-maven-project ---
[INFO] Deleting /home/sombriks/git/how-to-structure-java-projects/06-maven-project/target
[INFO] 
[INFO] --- resources:3.3.1:resources (default-resources) @ 06-maven-project ---
[INFO] skip non existing resourceDirectory /home/sombriks/git/how-to-structure-java-projects/06-maven-project/src/main/resources
[INFO] 
[INFO] --- compiler:3.11.0:compile (default-compile) @ 06-maven-project ---
[INFO] Changes detected - recompiling the module! :source
[INFO] Compiling 4 source files with javac [debug target 17] to target/classes
[INFO] 
[INFO] --- resources:3.3.1:testResources (default-testResources) @ 06-maven-project ---
[INFO] skip non existing resourceDirectory /home/sombriks/git/how-to-structure-java-projects/06-maven-project/src/test/resources
[INFO] 
[INFO] --- compiler:3.11.0:testCompile (default-testCompile) @ 06-maven-project ---
[INFO] Changes detected - recompiling the module! :dependency
[INFO] 
[INFO] --- surefire:3.1.2:test (default-test) @ 06-maven-project ---
[INFO] 
[INFO] --- jar:3.3.0:jar (default-jar) @ 06-maven-project ---
[INFO] Building jar: /home/sombriks/git/how-to-structure-java-projects/06-maven-project/target/06-maven-project-1.0-SNAPSHOT.jar
[INFO] 
[INFO] --- exec:3.1.0:java (default-cli) @ 06-maven-project ---
Item[message=General Kenobi!!]
Item[message=We're doomed!]
Item[message=I have a bad feeling about that...]
Item[message=Use the force, Luke.]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.265 s
[INFO] Finished at: 2023-10-01T01:16:47-03:00
[INFO] ------------------------------------------------------------------------
```

At this point the declarative approach used by maven shows again the unwanted
complexity that people where running away since that simple folder with a couple
of classes, but now due to indirection problems that several commodities brought
to the table.

Which brings the next level of project setup:

## Gradle

[Gradle](https://gradle.org/) tries to be more or less compatible with maven, it
even uses the same online registry to get java dependencies from internet, but
instead of xml to declare the project configuration, people thought it was a
good idea to use a full-featured [scripting language](https://groovy-lang.org/)
to do this mostly declarative job, spicing up things with occasional scripts.

It also showcases a daemon, so incremental builds can be performed faster at the
symbolic cost of 1GB of RAM. Good DX, bad on CI/CD pipelines.

~~The command line to create a gradle project is a bit faulty, even trying to~~
~~pass all possible parameters it still falls into a interactive prompt, but~~
~~here goes our best shot:~~

**UPDATE**: soon will be possible to use one single command line to create a
java application gradle project thanks to
[this PR](https://github.com/gradle/gradle/pull/26670).

The command follows:

```bash
cd 07-gradle-project
gradle init \
  --type java-application \
  --dsl groovy \
  --test-framework junit-jupiter \
  --package sample.structure \
  --project-name 07-gradle-project \
  --no-split-project \
  --java-version 17
```

After answering the final items, you earn this project layout:

```bash
07-gradle-project
├── app
│   ├── build.gradle
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── sample
│       │   │       └── structure
│       │   │           └── App.java
│       │   └── resources
│       └── test
│           ├── java
│           │   └── sample
│           │       └── structure
│           │           └── AppTest.java
│           └── resources
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
├── messages.json
└── settings.gradle
```

It not only added the [wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
plugin but also defined a [submodule](https://docs.gradle.org/current/userguide/multi_project_builds.html)
to house the application code.

And last but not least important, this is the [build.gradle](07-gradle-project/app/build.gradle)
file. It is the gradle equivalent of a `pom.xml` file:

```groovy
plugins {
    id 'application'
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.9.3'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'

    implementation 'com.google.guava:guava:32.1.1-jre'
    implementation 'com.google.code.gson:gson:2.10.1'
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

application {
    mainClass = 'sample.structure.HelloThere'
    // to fix an issue with the submodule
    tasks.run.workingDir = rootProject.projectDir
}

tasks.named('test') {
    useJUnitPlatform()
}
```

It has the same declarative principle that a maven pom.xml has.

You run your project with this command:

```bash
cd 07-gradle-project
./gradlew run
```

The output is something like this:

```bash
[sombriks@lucien 07-gradle-project]$ ./gradlew run

> Task :app:run
Item[message=General Kenobi!!]
Item[message=We're doomed!]
Item[message=I have a bad feeling about that...]
Item[message=Use the force, Luke.]

BUILD SUCCESSFUL in 496ms
2 actionable tasks: 2 executed
```

Quite clean!

## Conclusion

We got very far from that single folder with a couple of source files inside.
But hey, [there are more than half million of maven packages](https://central.sonatype.com/search)
at your disposal to consume.

By checking [the source code repo for this article](https://github.com/sombriks/how-to-structure-java-projects),
you can see the evolution commented in this article and in the previous one.

Happy hacking!

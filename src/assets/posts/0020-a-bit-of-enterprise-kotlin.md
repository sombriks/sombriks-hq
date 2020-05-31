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

```gradle
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

```gradle
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

// All kotlin classes are final by default, but we need to open them to the JEE magic
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


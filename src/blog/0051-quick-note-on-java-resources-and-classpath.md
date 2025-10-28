---
layout: blog.pug
tags:
  - posts
  - java
  - classpath
  - modules
  - node
date: 2023-05-01
draft: false
---
# Quick note on resources inside java classpath

On mildly hard issue every young java programmer faces is resource loading via
classpath.

[The java classpath](https://docs.oracle.com/javase/tutorial/essential/environment/paths.html)
is simple, it's just folders... **But no.**

## TL;DR

Don't use relative paths when loading classpath resources.

## The old module system issue

The first thing to address is how
[modular programming](https://en.wikipedia.org/wiki/Modular_programming) works.

In order to compile something you must feed the compiler with the input file.

Write the entire source into a single file is both simple and complex to
maintain.

In order to keep better maintenance level, most compilers and interpreters are
able to scan for other source code files across the filesystem given certain
rules.

### Traditional modules: files and folders

The most common module strategy is to take the filesystem as hint of modules
structure.

In a node application, one could structure modules like this:

```bash
project1
├── main.mjs
├── services
│   ├── auth.mjs
# a few other folders and files ...
```

And then inside the `main.js` you can import your module:

```javascript
import {login} from "./services/auth.mjs"
// more code
```

On node the modules **are** 1:1 with filesystem and files.

Other languages like [Go](https://go.dev/doc/code),
[PHP](https://www.php.net/manual/en/function.include.php) and
[Ruby](https://ruby-doc.org/3.2.2/Kernel.html#method-i-require) does the same,
defining an entry point and the rest of modules starting from there.

With java, the same is quite true, but there's more.

## The classpath isn't just for classes

Java classpath is detached from real file system, it's a virtual one. It must
work that way because not only java is meant to run on some unpredictable
environments (i.e. what if we have
[records](https://www.ibm.com/docs/en/file-manager-for-zos/14.1?topic=overview-data-sets-records)
instead of folders?), but also because the path must include packaged java
libraries: the [jar files](https://docs.oracle.com/javase/tutorial/deployment/jar/basicsindex.html).

Also, **every .class file is a resource**. Classloaders must be able to scan and
load class definitions from classpath and therefore make those classes available
to the running program.

But config files, sound and image assets and other things are also resources, so
the search for those extra resources also happens on classpath.

### Classpath calculation

Due to such complications, the java classpath mixes folders, files, virtual
folders and files and even arbitrary urls during it's 'calculation'.

Thing get even worse when we're dealing with modern java IDE's.

What you see inside a source folder isn't what you really gets after classpath
resolution. it combines resource folders and test folders in some cases as well.

Now let's pretend for a moment we're loading a text to use into our application.

If you write a loader like this:

```java
package org.example;
//...
    public String loadText() throws Exception {
        try(InputStream in = App.class.getResourceAsStream("text-file.txt")) {
            return new String(in.readAllBytes());
        }
    }
//...
```

Then the `text-file.txt` must be in the same package as the java class. Little
room for mistakes.

If you do, however:

```java
package org.example;
//...
    public String loadText() throws Exception {
        try(InputStream in = App.class.getResourceAsStream("/org/example/text-file.txt")) {
            return new String(in.readAllBytes());
        }
    }
//...
```

You get the same result with one extra bonus: the full path resolution inside
classpath makes things more clear.

It also makes transparent if your resource are either inside a jar file or a
filesystem.

### The main issue: relative paths

Those benefits are gone when you use relative paths. This test suite works fine:

```java
package org.example;

import org.junit.Assert;
import org.junit.Test;

public class AppTest {

    @Test
    public void shouldWorkOnDevelopmentModeAndJar() throws Exception {
        String result = new App().load("/root-resource.txt");
        Assert.assertEquals("i am root resource\n", result);
    }

    @Test
    public void shouldWorkOnDevelopmentModeAndFailInJar() throws Exception {
        String result = new App().load("../another-classpath-resource.txt");
        Assert.assertEquals("i am another classpath resource", result);
    }

    @Test
    public void shouldWorkAlways() throws Exception {
        String result = new App().load("classpath-resource.txt");
        Assert.assertEquals("i am a resource somewhere in classpath", result);
    }
}
```

But fails in runtime:

```bash
./mvnw clean install
java -jar target/classloader-issue-1.0-SNAPSHOT.jar /root-resource.txt # ok
java -jar target/classloader-issue-1.0-SNAPSHOT.jar classpath-resource.txt #ok
java -jar target/classloader-issue-1.0-SNAPSHOT.jar ../another/classpath-resource.txt #fail
```

That happens because the relative path goes over filesystem instead of jar file
and then finds nothing.

## Conclusion

Classpath calculations are an important topic when your code goes beyond simple
tasks and start to interact with other resources or systems, and there still
much more to see on that matter.

It's a hot topic when it comes to application servers, dynamic plugins and any
other sort of special way to interact with java code.

The sample code for this article can be found
[here](https://github.com/sombriks/classloader-issue).

Happy hacking!

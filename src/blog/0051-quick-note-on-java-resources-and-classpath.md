---
layout: blog-base.webc
tags:
  - posts
  - java
  - classpath
  - modules
  - node
date: 2023-04-22
draft: true
---
# Quick note on resources inside java classpath

On mildly hard issue every young java programmer faces is resource loading via
classpath.

[The java classpath](https://docs.oracle.com/javase/tutorial/essential/environment/paths.html)
is simple, it's just folders... **But no.**

## TL;DR

Don't use relative paths when loading classpath resources.

## The old modules issue

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

On node the modes **are** 1:1 with filesystem and files.

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

### The main issue: relative paths

Now let's pretend for a moment we're loading a text to use into our application.

If i write a

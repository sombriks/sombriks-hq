---
layout: blog-layout.pug
tags: 
  - posts
  - java
  - project structure
date: 2022-09-24
---
# How to structure a java project

It seems easy, but there is a reason people tend to use
[IDE](https://en.wikipedia.org/wiki/Integrated_development_environment)'s for everything.

## In the beginning

In [the time before the time itself](https://history-computer.com/computers-in-the-1980s/),
there was the shell command prompt and the memory. And sometimes there was
[the current directory](https://en.wikipedia.org/wiki/Directory_structure).

So in order to use computer to do some work you had to issue commands in the
shell that could affect or not the contents inside a directory.

A compiler is a program that transforms source code into a program.

Usually that source code is available in the current directory.

## Make a folder, put stuff inside

So the first java project is nothing more than a folder with some code inside.
Open a terminal and issue the commands bellow:

```bash
mkdir java-project-1
cd java-project-1
touch HelloThere.java
```

Now let's code our java program. I would recommend
[vi](https://www.cs.colostate.edu/helpdocs/vi.html) or
[joe](https://joe-editor.sourceforge.io/) in order to not get out of terminal
immersion, but boy let's not suffer that much.

```java
public class HelloThere {
  public static void main(String ...args) {
    System.out.println("General Kenobi!!");
  }
}

```

And once again in the terminal (it's still open, right?) compile your program:

```bash
javac HelloThere.java
```

It will produce a second file called `HelloThere.class` which is the file
containing the [java bytecode](https://en.wikipedia.org/wiki/Java_bytecode).
Unlike other compiled languages, the final product from the java compiler isn't
valid as operating system executable.

So we call the java virtual machine to run that:

```bash
$ java HelloThere
General Kenobi!!
```

### Making code modular

Create a new class, let's modify things in this project:

```bash
touch Grievous.java
```

And this is the code for this class:

```java
public class Grievous {
  public String sayHello() {
    return "General Kenobi!!";
  }
}
```

Modify HelloThere.java:

```java
public class HelloThere {
  public static void main(String ...args) {
    String message = new Grievous().sayHello();
    System.out.println(message);
  }
}
```

You can compile your classes as usual:

```bash
javac Grievous.java
javac HelloThere.java
```

Since classes are in the same folder, there will be no issue executing the
program:

```bash
$ java HelloThere
General Kenobi!!
```

Your folder looks like this now:

```bash
$ dir 
Grievous.class Grievous.java HelloThere.class HelloThere.java
```

## Sorting things better inside the project

As you can imagine, the more files you project have, the more it will be hard to
navigate.

So what can we do?

Yes, more folders!

```bash
mkdir src
mkdir bin 
mv *java src/
mv *.class bin/
```

Now there is a `src` folder to hold our source code and a `bin` folder to keep
the bytecode.

The compile command line changes a bit because of this folder layout:

```bash
javac -d bin -cp bin src/Grievous.java
javac -d bin -cp bin src/HelloThere.java
```

And the run command changes too:

```bash
java cp bin HelloThere
```

### The point of execution

Note that although code isn't present in the `java-project-1`, the program still
runs from that folder.

This is what we call point of execution. Technically speaking, it's not just the
current folder, but also several other OS-related environment values, but keep
in mind the importance of that folder.

For example, let's say that our program is now supposed to read a file from the
current directory:

```java
import java.io.*;
import java.util.*;

public class Grievous {
    
  public List<String> coolMessages() throws Exception {
    Scanner scan = new Scanner(new File("./messages.txt"));
    List<String> messages = new ArrayList<>();
    while(scan.hasNext()) {
      messages.add(scan.nextLine());
    }
    return messages;
  }
}

```

Then modify our main class to print out those messages:

```java
public class HelloThere {
  
  public static void main(String ...args) throws Exception {
    new Grievous()
      .coolMessages()
      .forEach(System.out::println);
  }
}
```

Compile everything:

```bash
javac -d bin -cp bin src/*.java
```

And before run the program, create the file _messages.txt_:

```txt
General Kenobi!!
We're doomed!
I have a bad feeling about that...
Use the force, Luke.
```

Folder structure should look like this:

```bash
java-project-1
├── bin
│   ├── Grievous.class
│   └── HelloThere.class
├── messages.txt
└── src
    ├── Grievous.java
    └── HelloThere.java
```

## Using an IDE

By this point is safe to say that a project complexity only grows over the time
and the features added to it.

This is why more powerful editors are popular.

All this intro was just to present you how java projects ended up so complex,
using tools so cabalistic yet no one seems bothered about this complexity.

It's unavoidable.

## Conclusion

Next steps would be add external dependencies by hand, like everyone used to do
in early 2000's and then show maven project structure, which is the _de-facto_
java project layout standard nowadays.

But that is already made by eclipse, netbeans, intellij and many others.

You can see the source code for this article
[here](https://github.com/sombriks/java-project-1).

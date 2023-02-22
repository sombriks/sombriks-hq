---
layout: blog-base.webc
tags: 
  - posts
  - misc
date: 2022-04-05
---
# Some history and thoughts about application entry point in a microservice era

**Notice:** i will point some concepts the way i remember them, feel free to
point out if i got something historically wrong or simply incorrect by any
communication channel available.

I tend to stick with the basics most of the time because we build things on top
of things that won't change anymore.

For example, in order to build a sky scrapper you will use concrete, invented by
Romans two thousand years ago.

For computer engineering however, it's debatable if there is such parallel, if
this field already have something like concrete. This science is young, and
quite naive, calling things created just 10 years ago as 'old'.

My car is 10 years old and remains modern.

Brutalist buildings remains quite modern.

When we're talking about computers, everything is new.

## But there is some clues on what could be the concrete for our field

The thing is, it's not that our concrete doesn't exists yet, we just might not
have identified that... yet.

For instance:

- Most program languages are *imperative*
- Networking, distributed systems aren't going to anywhere
- Relational databases still there, even their query languages appearing in
  NoSQL solutions
- Filesystems for storage are a thing

Those fundamental concepts are present in almost all modern software development
at some degree and likely will be there for the next hundred, maybe thousand
years.

The Filesystem one i want to detail a bit more.

## Where all things go and where they are in a more abstracted way

Back in time there is the memory.

It has addresses and it was finite, unlike the original
[abstract machine](https://en.wikipedia.org/wiki/Turing_machine).

So the very concept of location was quite strange, since all that existed was
the memory and the state.

Then came [Von Neumann](https://en.wikipedia.org/wiki/Von_Neumann_architecture)
and I/O concept, then things get strange.

## Slow persistent storage wasn't present in Turing Machine

We had to get clever due to physical limitations. For instance, punch cards and
magnetic tapes weren't the ideal form to interact with computers. Printers where
ok, since they cope the "output" step quite decently.

We got mechanical parts interacting with electric computers so the need of
optimizations where urgent.

## Data structures abstraction rise

The *node* concept was the fist step. One thing containing another thing.

```c
struct node {
  void *value;
};
```

I know that's a huge leap but let's ignore the entire odyssey about unix and
hierarchical filesystems.

In execution (after compiled), such code, once compiled would mean that a region
in main memory points out to another region memory.

Then that another memory region, much slower that the rest, had physical
limitations. Take the tape as example. We do sequential reads and writes, and
might need to skip entire records.

Our node might evolve into this:

```c
struct node {
  void *value;
  struct node *prev;
  struct node *next;
};
```

Now we not only got the value, but also the address of previous and next
registry.

This is how [linked lists](https://en.wikipedia.org/wiki/Linked_list) are built.

### What is better than a list

Once ordered, lists are quite easy to search. Time required to find something
inside a list is
[a logarithm over the list size](https://en.wikipedia.org/wiki/Binary_search_algorithm).

Based on binary search technique, people started to use
[tree structures](https://en.wikipedia.org/wiki/B-tree) abstractions to squeeze
some speed from low speed memory.

Most filesystems are still based on tree abstractions.

Filesystems are a strong candidate for *concrete*.

## Users folders and permissions

By the moment computers became not only programable but also reprogrammable, the
demand for them also raised. That led to time sharing, remote terminals and the
abstract idea of user hierarchy.

Instead of just programs residing in memory, now there are also users.

Which led to confusing concept of an user inside a folder, interacting with
programs and files using a shell.

Programs came from executable files, usually from folders present on PATH
environment variable. Yes there is an environment for users now.

Although users concur for computing resources they can't interfere in other user
resources if there is no explicit permission.

Users, environments and permissions are there even today and also a good
candidate for *concrete* in computing.

## Services from internet

When running locally, a program is tied to the
[current working directory](https://en.wikipedia.org/wiki/Working_director) and
what else the user running the program can do.

But when consuming programs over the internet, let's say a modern web
application, that concept gets a bit empty.

The service address is the new current working directory, and the agent (your
internet browser or your service client consuming the internet thing) is the new
user, environment and permissions.

## What else

That's it. i was thinking about entry point and how it changed through time.

I don't know if we can call service address as a true successor for operating
system-based programs entrypoint but it's a quite good candidate for *concrete*.

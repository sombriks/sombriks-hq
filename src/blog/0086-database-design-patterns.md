---
layout: blog-layout.pug
tags:
  - posts
  - sql
  - design patterns
date: 2025-12-10
---
# Design patterns for SQL databases

If you don't know the name of something, you will end up reinventing that
something and feel very smart by doing it.

So, let's be humble and be aware of cool techniques will cool names that
everyone doing SQL databases end up in need of at some point in a project.

Some names you already heard about already, back in the school. Some techniques
you already uses but didn't knew the name. Maybe there is something new, but
this is precisely why this article exists.

So, let's get started with the easy and popular ones first.

## Normalization

This is what you learn back in the school. The [Edgar F. Cobb][efcobb] normal
forms are the basic technique for database modelling.

In short:

- First normal form is all about to get rid of duplicate data.
- Second normal form is about primary key definition.
- Third normal form is about to get information expressed in terms of other
  information to rely on keys as well, either primary or secondary keys.

Superior normal forms are about how atomic, consistent data relates to each
other in join operations.

The important action on normalization s to get rid of inconsistencies and
duplicated information.

For example, one careless way to model "Alice and Bob are married and live in
Elm Street, 123" is:

<figure>
<pre>
    ┌──────────┐
    │ Marriage │  ┌────────┐
    ├──────────┤  │ Person │
    │ person1  │  ├────────┤
    │ person2  │  │ name   │
    └──────────┘  └────────┘
         ┌─────────┐
         │ Address │
         ├─────────┤
         │ person1 │
         │ person2 │
         │ street  │
         └─────────┘
</pre>
<figcaption>A pretty bad database schema</figcaption>
</figure>

The schema above is bad in many ways:

- Not a single primary key, two "Bobs" will make the task of figure out who is
  married with "Alice" an impossible task.
- Share the same address with more than two people is also troublesome.
- In some cultures, it's possible to marry more than one people.

## Denormalization

// short intro

// basic usage

// example

## Historical columns

// short intro

// basic usage

// example

## Append-only ledger

// short intro

// basic usage

// example

## Event sourcing

// short intro

// basic usage

// example

## Longitudinal tables

// short intro

// basic usage

// example

## Snapshot tables

// short intro

// basic usage

// example

## Conclusion

[efcobb]: https://en.wikipedia.org/wiki/Edgar_F._Codd

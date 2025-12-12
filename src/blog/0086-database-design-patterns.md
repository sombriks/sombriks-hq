---
layout: blog-layout.pug
tags:
  - posts
  - sql
  - design patterns
date: 2025-12-13
---
# Design patterns for SQL databases

If you don't know the name of something, you will end up reinventing that
something and also feel very smart by doing it. One's pride is the comedy of
others.

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

Now, consider this one:

<figure>
<pre>
    ┌──────────┐
    │ Marriage │  ┌───────────────┐
    ├──────────┤  │ Person        │
    │ id       │  ├───────────────┤
    └──────────┘  │ id            │
                  │ name          │
                  │ marriage_id   │
                  │ address_id    │
                  └───────────────┘
         ┌─────────┐
         │ Address │
         ├─────────┤
         │ id      │
         │ street  │
         └─────────┘
</pre>
<figcaption>A somewhat better database schema</figcaption>
</figure>

- Now people can have the same name but be different persons.
- Marriage with more than a couple is solved, but this introduces the chance of
  a lone married person to appear, as well as marriages with no persons.
- Addresses can now house as many people as needed.

Lots of new information can now be extracted with [join operations][join].

## Denormalization

The second database design pattern is The opposite of the the first one.

But how come it to be considered a design pattern?

One important thing to consider when designing a database is **performance**.
Indeed, data consistency is paramount, this is why the fist step is always
design a consistent database schema, but when put to do real work, the
bottlenecks appears and you start to add *small inconsistencies* to save you
from lots of extra lookups.

In short, identify on your *running database* critical points demanding extra
operations to produce the information in high demand and then *denormalize* it.

Take this voting system scenario:

<figure>
<pre>
     ┌──────────────┐
     │ Vote         │       ┌─────────────┐
     ├──────────────┤       │ Candidate   │
     │ id           │       ├─────────────┤
     │ candidate_id │       │ id          │
     └──────────────┘       │ election_id │
            ┌──────────┐    └─────────────┘
            │ Election │
            ├──────────┤
            │ id       │
            │ year     │
            └──────────┘
</pre>
<figcaption>A consistent, normalized, non-performatic schema</figcaption>
</figure>

This schema is pristine. All by the book. However:

- If i ask 'who won 2022 elections?', i will always need to check all candidates
  of that election, and for each one count the votes.
- Election results are not time-resilient: one flip in a past vote can change
  past results. "It should never happen" are *famous last words* written in many
  tombstones all over the world.

To tackle down such issues, the schema can be modified to something like this:

<figure>
<pre>
     ┌──────────────┐
     │ Vote         │       ┌─────────────┐
     ├──────────────┤       │ Candidate   │
     │ id           │       ├─────────────┤
     │ candidate_id │       │ id          │
     └──────────────┘       │ total_votes │
                            │ election_id │
            ┌───────────┐   └─────────────┘
            │ Election  │
            ├───────────┤
            │ id        │
            │ year      │
            │ winner_id │
            └───────────┘
</pre>
<figcaption>A somewhat consistent, denormalized, performatic schema</figcaption>
</figure>

Chances are simple, but materializes derivative data as first-class data in the
database schema. On the other hand, they save us potentially from performing
millions of operations to deliver a highly demanded information.

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
[join]: https://en.wikipedia.org/wiki/Join_(SQL)

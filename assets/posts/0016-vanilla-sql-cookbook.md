# The vanilla (or raw, your call) SQL cookbook

Every time someone creates a new way of persistence, given enough time it will
rediscover SQL.

I'm serious.

Documents, eventual consistency, 100% artificial keys... Everything comes back
to the good and old
[Relational Algebra](https://en.wikipedia.org/wiki/Relational_algebra). We
always come back to the math of the thing, and later some smart query language.
Which comes to be SQL. One of it's dialects.

Here we'll present a very opinionated way to deal with the most important asset
of any modern business: the data produced by customers.

## 1 - Always know your database runtime

It's a major mistake to believe that the database is something unimportant and
distant since your shiny framework can deal near all interactions in a very
automatized way. Do not worship ORM's too much, they are lesser gods.

Know which MySQL or MariaDB version you're running, if that Oracle database has
the exact set of features you just learned, know even if it's safe to use views
and triggers and if this particular SGBD is ISO 2003 or not.

## 2 - Your Schema WILL evolve

Be sure about one thing: Everything can change. Your sole hope is to be faster
than the changes, so you always get that one foot ahead of the problems.

In order accomplish that, adopt some migrate strategy. That way you not only can
safely develop  
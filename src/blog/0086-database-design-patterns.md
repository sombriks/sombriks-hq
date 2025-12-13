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

Changes are simple, just materializes derivative data as first-class data in the
database schema. On the other hand, they save us potentially from performing
expensive operations to deliver a highly demanded information.

## Historical columns

The third design i present is one that you can find when searching for the past
value issue. Whenever keep track of changes that a certain column suffers over
time is needed, this pattern is the one to apply.

Take this simple example:

<figure>
<pre>
┌─────────────┐
│ Product     │
├─────────────┤
│ id          │  ┌────────────┐
│ description │  │ Sale       │
│ price       │  ├────────────┤
└─────────────┘  │ id         │
                 │ product_id │
                 └────────────┘
</pre>
<figcaption>Product table</figcaption>
</figure>

This table is barely enough to describe a product and its price.

However, what happens if we decide to change the product price? We update it,
yes, but by doing so, we not only promote loss of information but also corrupts
existing sales entries.

To avoid this,add a third table to track prices:

<figure>
<pre>
┌──────────────────┐
│ Product          │
├──────────────────┤                   ┌──────────────┐
│ id               │  ┌────────────┐   │ Sale         │
│ description      │  │ PriceTag   │   ├──────────────┤
│ current_price_id │  ├────────────┤   │ id           │
└──────────────────┘  │ id         │   │ price_tag_id │
                      │ product_id │   └──────────────┘
                      │ start_date │
                      │ price      │
                      └────────────┘
</pre>
<figcaption>PriceTag table</figcaption>
</figure>

With this arrangement, it's now possible to update a product price and still
keep track of earings sales correctly.

In the example, there is also a key for the current price tag on the product. It
is added just to avoid funky operations to discover the latest price tag
available for a product. But this is a denormalization, so a careless operation
can introduce inconsistencies to the data.

## Append-only ledger

Another design patter focused on keep track of changes over time, this pattern
differentiates from historical columns by registering changes not only in time,
but also the nature of the change.

Additionally, as the name suggests, Append-only ledger forbids updates on the
table storing the transactions.

Take this simple banking schema as example:

<figure>
<pre>
┌─────────┐
│ Account │
├─────────┤
│ id      │
│ balance │
└─────────┘
</pre>
<figcaption>Sample accounts system</figcaption>
</figure>

Common operations, like deposit, withdraw and transfer can be translated into
queries like this:

```sql
-- a transfer
update Acvcount set balance = balance + 100 where id = 1;
update Acvcount set balance = balance - 100 where id = 2;
-- deposit
update Acvcount set balance = balance + 200 where id = 2;
-- withdraw
update Acvcount set balance = balance - 50 where id = 2;
```

However, there is a huge loos of information here, since those distinct banking
operations are reduced to updates and then vanishes for good.

Creating a ledger allows the proper representation of those events:

<figure>
<pre>
┌─────────┐
│ Account │
├─────────┤   ┌────────────────┐
│ id      │   │ AccountLedger  │
│ balance │   ├────────────────┤
└─────────┘   │ id             │
              │ account_id     │
              │ operation_type │
              │ amount         │
              │ date           │
              └────────────────┘
</pre>
<figcaption>Sample accounts system with ledger</figcaption>
</figure>

Now the operations can be stored like this:

```sql
-- a transfer
insert into AccountLedger (account_id,operation_type,amount) values (1,'deposit',100);
update Acvcount set balance = balance + 100 where id = 1;
insert into AccountLedger (account_id,operation_type,amount) values (2,'withdraw',-100);
update Acvcount set balance = balance - 100 where id = 2;
-- deposit
insert into AccountLedger (account_id,operation_type,amount) values (2,'deposit',200);
update Acvcount set balance = balance + 200 where id = 2;
-- withdraw
insert into AccountLedger (account_id,operation_type,amount) values (2,'withdraw',-50);
update Acvcount set balance = balance - 50 where id = 2;
```

The account balance becomes a derivative property, based on all ledger
operations involving that account.

Another side effect of this is the need of [transactions][transaction], because
both insert and update operations must complete together or fail altogether.

How it differs rom historical tables?

While ledgers focus on events acting on a single column historical columns are
the state of that column over the time.

## Event sourcing

Now it's time to talk about event sourcing.

This pattern become widely popular because all the
[microservice mania][microservice].

This pattern is especially useful for
[distributed transactions][dist-transactions], since event sourcing creates a
*single source of truth* for several and somewhat distinct tables.

Let's look at the following schema:

<figure>
<pre>
┌─────────────┐
│ Order       │
├─────────────┤   ┌────────────┐
│ id          │   │ OrderItem  │
│ customer_id │   ├────────────┤
│ status      │   │ id         │
└─────────────┘   │ order_id   │
                  │ product_id │
                  │ amount     │
                  └────────────┘
</pre>
<figcaption>Orders system</figcaption>
</figure>

The order journey could be like this:

```sql
insert into Order(customer_id,"status") values (123,'open');
-- returned id 11
insert into OrderItem(order_id,product_id,amount) values (11,121,10);
insert into OrderItem(order_id,product_id,amount) values (11,122,1);
insert into OrderItem(order_id,product_id,amount) values (11,123,200.4);
-- order was assembled in warehouse and shipped
update Order set "status" = 'shipped' where id = 11;
```

Again, we witness the loss of information regarding the events needed to build
all those states.

Let's modify the schema:

<figure>
<pre>
┌─────────────┐
│ Order       │
├─────────────┤   ┌────────────┐
│ id          │   │ OrderItem  │
│ customer_id │   ├────────────┤
│ status      │   │ id         │
└─────────────┘   │ order_id   │
                  │ product_id │
                  │ amount     │
                  └────────────┘
           ┌────────────┐
           │ OrderEvent │
           ├────────────┤
           │ id         │
           │ date       │
           │ type       │
           │ payload    │
           └────────────┘
</pre>
<figcaption>Orders system</figcaption>
</figure>

Now, the order journey can be represented by those operations:

```sql
insert into Order(customer_id,"status") values (123,'open');
-- returned id 11
insert into OrderEvent("type",payload) values ('create_order','id:11;customer_id:123;status:open');

insert into OrderItem(order_id,product_id,amount) values (11,121,10);
-- returned id 1111
insert into OrderEvent("type",payload) values ('add_order_item','id:1111;order_id:11;product_id:121;amount:10');

insert into OrderItem(order_id,product_id,amount) values (11,122,1);
-- returned id 1112
insert into OrderEvent("type",payload) values ('add_order_item','id:1112;order_id:11;product_id:122;amount:1');

insert into OrderItem(order_id,product_id,amount) values (11,123,200.4);
-- returned id 1115
insert into OrderEvent("type",payload) values ('add_order_item','id:1115;order_id:11;product_id:123;amount:200.4');

-- order was assembled in warehouse and shipped
update Order set "status" = 'shipped' where id = 11;
insert into OrderEvent("type",payload) values ('ship_order','id:11;status:shipped');
```

Again, a transaction will be needed when sourcing the events.

Note that the *payload* may cause loss of information if some column does not
participate in the set of values, or if columns cease to exist, or new columns
appear and get specific rules that does not apply on older versions of database
schema, or if sor some reason one event is deleted. But this is a ner concern,
schema evolution.

Simpler databases doesn't have the maturity or the age for his to be a problem.

Event sourcing differs from append-only ledger because while ledgers tracks one
single column, on events we encode entire journeys, enabling us to reproduce the
current system state by simply replaying the events.

Note also the choice for an transparent structure to model the format of the
payload. It is transparent for the database schema because, for the database,
the payload is just a huge string.

The tradeoff is high, but it is common on event sourcing because of two main
reasons:

- Events mus be plastic enough to produce one single timeline for all distinct
  operations involving distinct tables.
- Events are usually propagated over the network of systems acting on the same
  distributed transaction. Therefore a kind of *esperanto* is useful for
  communication in a highly heterogeneous field of (micro)services.

## Longitudinal tables

This database design pattern is one of the most powerful ones, it stores raw
data in a way that several levels of information refinement are possible.

It introduces several redundancies that might seem a waste at first, but even on
the repetition is invaluable information encoded.

// basic usage

// example

## Snapshot tables

// short intro

// basic usage

// example

## Conclusion

[efcobb]: https://en.wikipedia.org/wiki/Edgar_F._Codd
[join]: https://en.wikipedia.org/wiki/Join_(SQL)
[transaction]: https://en.wikipedia.org/wiki/Database_transaction
[microservice]: https://dzone.com/microservices
[dist-transactions]: https://en.wikipedia.org/wiki/Distributed_transaction

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

Even nowadays, where you can issue an
[one](https://hub.docker.com/_/mysql#start-a-mysql-server-instance)
[line](https://hub.docker.com/_/postgres#start-a-postgres-instance)
[docker](https://hub.docker.com/r/oracleinanutshell/oracle-xe-11g)
[command](https://hub.docker.com/r/microsoft/mssql-server-linux) and get the
database up and running

## 2 - Your schema WILL evolve

Be sure about one thing: Everything can change. Your sole hope is to be faster
than the changes, so you always get that one foot ahead of the problems.

In order accomplish that, adopt some migrate strategy. That way you not only can
safely develop your solution but also make sure other development instances will
run smoothly.

## 3 - The backup is part of your workflow

Automatize it. Spare project time to manage it. Add a backup screen.

## 4 - The type and status tables are your friends

Let's say the customer needs a listing of complaints. So you imagine a table to
store that:

```sql
create table complaints(
  id integer not null primary key auto_increment,
  msg text not null
);
```

Later he comes asking for a listing of compliments:

```sql
create table compliments(
  id integer not null primary key auto_increment,
  msg text not null
);
```

Then one with suggestions:

```sql
create table suggestions(
  id integer not null primary key auto_increment,
  msg text not null
);
```

And of course he asks for one listing merging all those ones in a single feed.
This kind of scenario leads us to this:

```sql
select
  *
from
  complaints
union select
  *
from
  compliments
union select
  *
from
  suggestions;
```

If you identify tables that gets too similar, maybe they are the same thing.
It's possible to achieve not the same thing, but something better if we add an
type table:

```sql
create table msg_type(
  id integer not null primary key,
  dsc varchar(255) unique not null
);
```

Those three tables become one:

```sql
create table messages(
  id integer not null primary key auto_increment,
  msg_type_id integer not null,
  msg text not null,
  foreign key msg_type_id references msg_type(id)
);
```

And the query to build the feed becomes trivial:

```sql
select * from messages;
```

In similar fashion, status tables will manage to give you simpler ways to
represent some change related to the real world interactions which entities
perform.

Instead of this:

```sql
create table issue(
  id integer not null primary key auto_increment,
  dsc text not null,
  solved boolean not null default false
);
```

Do this:

```sql
create table issue_status(
  id integer not null primary key,
  dsc varchar(255) unique not null
);

insert into issue_status (id,dsc) values (1,'open');
insert into issue_status (id,dsc) values (1,'solved');

create table issue(
  id integer not null primary key auto_increment,
  dsc text not null,
  solved integer not null default 1
);
```

By using this approach you can even create additional statues in the future.

## 5 - The 'insert into' (...) 'select' data morphing

It's natural to morph data from one table to another. Remember, the schema will
change.

One approach is to write a migration doing the inserts for the new data and
another deleting data from the old tables.

Another way to do that is one migrate doing the insert based on a select query.
For example:

```sql
-- this is the old table

create table complaints(
  id integer not null primary key auto_increment,
  msg text not null
);

-- this is the old data

insert into complaints (id,msg) values (1,'too old');
insert into complaints (id,msg) values (2,'too tall');
insert into complaints (id,msg) values (3,'too ugly');

-- these are the new tables

create table msg_type(
  id integer not null primary key,
  dsc varchar(255) unique not null
);

create table msg_status(
  id integer not null primary key,
  dsc varchar(255) unique not null
);

create table messages(
  id integer not null primary key auto_increment,
  msg_type_id integer not null default 1,
  msg_status_id integer not null default 1,
  msg text not null
);

-- this is the auxiliary data

insert into msg_type (id,dsc) values (1, 'complaint');
insert into msg_type (id,dsc) values (2, 'compliment');
insert into msg_type (id,dsc) values (3, 'suggestion');

insert into msg_status (id,dsc) values (1, 'open');
insert into msg_status (id,dsc) values (2, 'resolved');

-- and this is how do you load new data based on the old data

insert into messages (id,msg) select id,msg from complaints
```

Since column names are matching, there is no need to alias column names.

## 6 - The natural (left) joins

## 7 - For complex queries, make views

## Conclusion

2019-03-28

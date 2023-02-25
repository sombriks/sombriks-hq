---
layout: blog-base.webc
date: 2023-02-25
tags: ['posts', 'knex', 'koa', 'c8', 'mocha', 'chai', 'node', 'sql', 'dotenv-flow']
---

# Knex rocks here's why

[Back in time](/blog/0005-updated-knex-bookshelf-cookbook/) i did a few
experiments and serious projects using [knex.js](https://knexjs.org/) and it
went well.

But it was some time ago and i was wondering if knex still worth the effort.

So here we are!

## Knex what?

It's a SQL query builder. Unlike traditional ORM frameworks, a query builder
doesn't tries to hide the database from you as much as possible.

Instead, you map your queries in a way that is easier to build queries, not
necessarily mapping entities.

Example, one could query books from a database like this using
[JPA](https://blog.payara.fish/getting-started-with-jakarta-ee-9-jakarta-persistence-api-jpa):

```java
//...
String q = "select b from Books b where b.title like concat('%', :title, '%')";
List<Book> books = entityManager
  .createQuery(q, Book.class)
  .setParameter("title", "mancer")
  .getResultList();
  // ...
```

We're omitting several things here like model mapping and persistence unit setup
but it's enough to feel how much indirection is involved.

If we decide to use [spring repositories](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/),
things get a little better, but not that much:

```java
//...
@Repository
public interface BookRepository extends JpaRepository<Book,Long> {

  List<Book> findByTitleLike(String title);
}
//...
List<Book> books = entityManager = repository.findByTitleLike("mancer");
// ...
```

Still need to define entity model but now we need to master the black magic of
proper naming your repository method name. And this thing has limitations as you
can imagine, making us to rely on @Query annotations which dumps us back to the
original issue with plain JPA.

On node side, [Sequelize](https://sequelize.org/docs/v6/category/core-concepts/)
doesn't get much better:

```js
// import {Book} from "../models"
// import {Op} from "sequelize" 
//...
const books = Book.findAll({
  where: {
    title: {
      [[Op.substring]: 'mancer']
    }
  }
})
//...
```

The syntax looks a little clear but it's still an ORM and therefore we're still
facing undesired indirections on model mappings.

### Ok what about Knex?

With knex you can do this:

```js
//...
const books = knex("book").whereLike("title", `%mancer%`)
//...
```

There are [interesting variations](https://knexjs.org/guide/query-builder.html#wherelike)
of this, but you get the idea.

## So OM's are bad

No, but they shouldn't stay on your way.

For instance, JPA, Spring Data and Sequelize (And [Objection](https://vincit.github.io/objection.js/guide/getting-started.html)
too, whi is built on top of knex) offers ways to skip all the model mapping
drama and access the database directly.

But there are scenarios where the advantages os that abstract layer worth the
effort.

It's just we're not here today to dig on those scenarios.

## A cleaner way to retrieve data

The simple and concise queries helps to keep tooling out of our way when doing
more important things.

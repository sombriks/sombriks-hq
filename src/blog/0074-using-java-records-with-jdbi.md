---
layout: blog-layout.pug
tags:
  - posts
  - java
  - sql
  - jdbi
  - records
  - shorts
date: 2024-12-07
draft: false
---
# Java records as your model/DTO with JDBI

This is a short one, but it's clean and easy to maintain so i can't be silent.

## Using regular POJOs

The classical way to get the results from JDBI queries is mapping them into
Plain Old Java Objects. For example:

```java
// some imports

public class TodoItem {
  private long id;
  private String description;
  private boolean done;
  private Date created;

  // some tedious getters and setters
}
```

You can create and register a JDBI mapper for this one quite easily:

```java
Jdbi jdbi = Jdbi.create("jdbc:h2:./todos");
// ...
jdbi.registerRowMapper(BeanMapper.factory(TodoItem.class));
// ...
```

Then query/insert/etc normally:

```java
// ...
List<TodoItem> items = handle
  .createQuery("select * from todos")
  .mapTo(TodoItem.class)
  .list();
// ...
handle.createUpdate("""
  insert into todos (description, done, created) 
  values (:description, :done, :created)
  """)
  .bindBean(newTodoItem)
  .execute();
```

## Using java records

Let's convert our pojo into a record:

```java
public record TodoItem(long id, String description, boolean done, LocalDateTime created);
```

Pretty nice, right? Resembles a lot Kotlin's data classes.

In order to use records instead of pojos, there are two important changes.

First change the mapper to ConstructorMapper:

```java
Jdbi jdbi = Jdbi.create("jdbc:h2:./todos");
// ...
jdbi.registerRowMapper(ConstructorMapper.factory(TodoItem.class));
// ...
```

Second, use `bindMethods` instead of `bindBean`:

```java
// ...
handle.createUpdate("""
  insert into todos (description, done, created) 
  values (:description, :done, :created)
  """)
  .bindMethods(newTodoItem)
  .execute();
```

## Models/ORM versus DTO/Query Mapper

There is always somewhere in the globe some debate about ORMs, DTOs and so on.

Records allow us to write better, cleaner DTOs but not every ORM can handle them
right now.

Lighter approaches like JDBI can benefit from records today in a very clean way.

Happy hacking!

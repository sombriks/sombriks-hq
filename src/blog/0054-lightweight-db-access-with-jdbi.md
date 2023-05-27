---
layout: blog-base.webc
tags:
  - posts
  - kotlin
  - javalin
  - microservices
  - liquibase
  - jdbi
  - sql
  - h2
date: 2023-05-27
draft: true
---
# Lightweight database access with jdbi

In this post we'll sample a nice framework called [jdbi](https://jdbi.org/).

## Why not JPA or something else?

[JPA](https://jakarta.ee/specifications/persistence/) is a handy and exellent
specification, don't get me wrong. Manually deals with
[JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/)
is still a herculean task and might not worth the expected performance gain.

On the other hand, JPA delivers lots of solutions for problems that you might
not have yet and keep remembering all the time that joinColumn relates to the
side 'owning' the relation and the inverseJoinColumn relates to the 'owned' side
is tiresome

But let's not keep doing this 'why not X' exercise because we could do the same
for [mybatis](https://mybatis.org/mybatis-3/), [jooq](https://www.jooq.org/),
you name the next one.

## Why jdbi?

- Lightweight
- Easy to understand
- Easy to integrate
- Scales well, up and down

The api itself is [quite beautiful](https://jdbi.org/#_api_overview), you can
choose what style pleases you more and is easier to maintain.

## Combining with more (lightweight) frameworks

When aiming for low resource consumption, there are a few other options in sight
to combine with jdbi

## Conclusion

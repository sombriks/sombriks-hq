# Thoughts on persistence layer and it's solutions

One of the most important things in a modern solution is the data being 
manipulated. True treasure one can say, or just tables with text inside other
can argue.

In this article we'll map our database to be used inside our code. Three times.
with distinct frameworks. So we can compare them.

## The database schema

First things first, we'll use this database schema:

![01-my-party-schema.png](assets/post-pics/0011-about-jpa-sequelize-and-bookshelf/01-my-party-schema.png)

We will not discuss [migrations](#/blog/0005-updated-knex-bookshelf-cookbook.md)
here, although it's a *de-facto* standard pattern to manage schema evolutions.

## First Challenger: JPA

[Java Persistence API](https://docs.oracle.com/javaee/7/tutorial/partpersist.htm)
is an enterprise java spec quite popular even 
[outside the JEE](http://spring.io/projects/spring-data-jpa) (now called
[Jakarta EE](https://jakarta.ee/)! did you saw it coming?) bubble.


On the JPA world, Our `Person` class (every table become a class) will look like
this:

```java
package hq.sombriks.sample.model;


public class Person {

}
```


When dealing with ORM's, some of them are capable of generate the entire schema
for you. 

It's nice for prototyping, but annoying when you need to make it play nice with
preexisting schema, which is the case with many big business needs.

JPA is one of these guys.
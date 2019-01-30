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
here, although it's a _de-facto_ standard pattern to manage schema evolutions.

## First Challenger: JPA

[Java Persistence API](https://docs.oracle.com/javaee/7/tutorial/partpersist.htm)
is an enterprise java spec quite popular even
[outside the JEE](http://spring.io/projects/spring-data-jpa) (now called
[Jakarta EE](https://jakarta.ee/)! did you saw it coming?) bubble.

On the JPA world, Our `Person` class (every table become a class) will look like
this:

```java
package hq.sombriks.sample.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

@Data
@Entity
@Table(name = "person")
public class Person {

  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "person_id")
  private Integer id;

  @Column(name = "creation")
  @Temporal(TemporalType.TIMESTAMP)
  private Date creation;

  @Column(name = "person_name")
  private String name;

  @PrePersist
  public void preInsert() {
    if (creation == null)
      creation = new Date();
  }
}
```

On this first example, a few notes:

- The `@Data` annotation comes from [project Lombok](https://projectlombok.org/)
  and relieves from the tedious work of create get/set methods.
- JPA can use attribute name as column name. However our database uses
  underscores in the table and field names and it's a kind of bad practice.
  Therefore we need te `@Column` annotation to rename it.
- The @PrePersist part is a exotic edge case to help JPA to not try to insert a
  null value where it shouldn't.

Let's see `Party`, `PartyStatus` and `PartyType`:

```java
package hq.sombriks.sample.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.JoinColumn;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

@Data
@Entity
@Table(name = "party")
public class Party {

  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "party_id")
  private Integer id;

  @Column(name = "party_creation")
  @Temporal(TemporalType.TIMESTAMP)
  private Date creation;

  @Column(name = "party_title")
  private String title;

  @JoinColumn(name = "person_id")
  private Person hoster;

  @JoinColumn(name = "party_status_id")
  private PartyStatus status;

  @JoinColumn(name = "party_type_id")
  private PartyType type;

  @PrePersist
  public void preInsert() {
    if (creation == null)
      creation = new Date();
    if (status == null)
      status = new PartyStatus(1);
    if (type == null)
      type = new PartyType(1);
  }
}
```

```java

```

```java

```
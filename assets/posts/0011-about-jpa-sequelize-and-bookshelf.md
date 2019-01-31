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
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

@Data
@Entity
@Table(name = "person")
public class Person {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "person_id")
  private Integer id;

  @Column(name = "person_creation")
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

Let's see the `Party` entity:

```java
package hq.sombriks.sample.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

@Data
@Entity
@Table(name = "party")
public class Party {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "party_id")
  private Integer id;

  @Column(name = "party_creation")
  @Temporal(TemporalType.TIMESTAMP)
  private Date creation;

  @Column(name = "party_title")
  private String title;
  
  @OneToOne
  @JoinColumn(name = "person_id")
  private Person hoster;

  @OneToOne
  @JoinColumn(name = "party_status_id")
  private PartyStatus status;

  @OneToOne
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

One cool thing about JPA is the way it handles foreign keys. Using `@JoinColumn`
and `@OneToOne` on a class property which is an entity too will bring it from
database too when we query for it. 

One could query for these entities like this:

```java
package hq.sombriks.sample;

import static org.junit.Assert.assertEquals;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import hq.sombriks.sample.model.Person;

@SpringBootTest
@RunWith(SpringRunner.class)
public class SampleApplicationTests {

	@PersistenceContext
	private EntityManager em;

	@Test
	public void contextLoads() {
	}

	@Test
	public void shouldListPeople() throws Exception {
		List<Person> people = em.createQuery("select p from Person p", Person.class)//
				.getResultList();
		assertEquals(8, people.size()); // see sample-data.sql
	}

}
```

The `EntityManager` has this special
[query language](https://en.wikipedia.org/wiki/Java_Persistence_Query_Language)
and also a [criteria query](https://en.wikibooks.org/wiki/Java_Persistence/Criteria#From)
api (which is a little horrible to read but is strongly typed).

In this case we're using JPA with a spring boot project created by 
[spring boot initializr](https://start.spring.io/).

## Another approach: Sequelize



2019-01-31
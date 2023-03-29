---
layout: blog-base.webc
tags:
  - posts
  - sql
  - nosql
  - mysql
  - mongodb
date: 2023-03-28
---
# SQL / NoSQL quick comparison

Small samples using [MySQL](https://www.mysql.com/) and
[MongoDB](https://www.mongodb.com/) as subjects to compare a few chores that are
similar in day to day database handling.

## Basic management

The most basic tools to secure, interact and do other basic tasks on each
database engine.

### Installation

<div class="comparison-box"><div>

There
are [several ways](https://www.google.com/search?q=how+to+install+mysql+on)
to install mysql.

This is how to install it on [fedora](https://getfedora.org/) /
[red hat](https://www.redhat.com/technologies/linux-platforms/enterprise-linux)
and compatible systems:

```bash
sudo npm install community-mysql community-mysql-server
```

</div><div>

Mongodb provides
[several installation options](https://www.mongodb.com/docs/manual/installation/).

Just choose the proper download option that better suits your operating system.

</div></div>

### Running the service

When installed on bare metal, it's just a matter of enable the service and start
it:

<div class="comparison-box"><div>

For mysql:

```bash
sudo systemctl start mysqld
```

</div><div>

[For mongodb](https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-red-hat/#procedure):

```bash
sudo systemctl start mongod
```

</div></div>

### Secure installation

<div class="comparison-box"><div>

Once mysql is installed, it's important to run `mysql_secure_installation`. It
takes care of allow/deny root connections, remove anonymous users and _test_
database.

</div><div>

Mongodb has a dedicated
[security checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
with several chores to perform after install it.

Most critical are:

- [create db root user](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/#create-the-user-administrator)
- [enforce authentication](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)
- [configure role-based access control](https://www.mongodb.com/docs/manual/reference/built-in-roles/)

Example creating a root user
via [mongosh](https://www.mongodb.com/docs/mongodb-shell/):

```javascript
db.createUser(
  {
    user: "root",
    pwd: passwordPrompt(), // or clear text password
    roles: [
      {role: "userAdminAnyDatabase", db: "admin"},
      {role: "readWriteAnyDatabase", db: "admin"}
    ]
  }
)
```

Example mongo configuration (`/etc/mongod.conf`) enforcing auth:

```yaml
# mongod.conf
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
storage:
  dbPath: /var/lib/mongo
  journal:
    enabled: true
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
net:
  port: 27017
  bindIpAll: true
security:
  authorization: enabled

```

_Note_: mongosh still connects normally without any credentials, but it's denied
to perform anything but authenticate:

```javascript
use
admin
db.auth("root", passwordPrompt()) // or clear text password
```

</div></div>

### Tools

<div class="comparison-box"><div>

The following tools are fine options to work with mysql databases:

- [Mysql CLI](https://dev.mysql.com/doc/refman/8.0/en/mysql.html)
- [DBeaver Community](https://dbeaver.io/download/)
- [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/)

There is no official cloud-ready service offering mysql databases
specifically, but you can setup an
[oracle always free vm](https://www.oracle.com/cloud/free/)
and spin up mysql on it.

</div><div>

These are the tools to work with mongodb more easily:

- [mongosh](https://www.mongodb.com/docs/mongodb-shell/)
- [Compass](https://www.mongodb.com/products/compass)
- [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)
- [Mongodb Atlas](https://www.mongodb.com/atlas/database)

Mongodb Atlas is a nice online service which you can use for free to keep
your data online.

</div></div>

### Login

<div class="comparison-box"><div>

With mysql, there is a command line tool to log in into the databases:

```bash
mysql -h localhost -u root -ppassword 
```

</div><div>

With mongodb, there is [mongosh](https://www.mongodb.com/docs/mongodb-shell/),
a command line tool to interact with the collections:

```bash
mongosh "mongodb://localhost" \ 
  --username root \ 
  --password password \
  --authenticationDatabase=admin
```

It's important to indicate the
[authenticationDatabase](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)
parameter to proper authenticate. It's a mongo thing.

</div></div>

### Database creation

<div class="comparison-box"><div>

With mysql, it's a single command. You need to create a database before anything
else in order to save your data:

```sql
create
database movies; 
```

</div><div>

With mongodb you don't need to create a database upfront.

</div></div>

### Database selection/use

<div class="comparison-box"><div>

Once database is created, tell mysql you want to use it.

Pretty straightforward:

```sql
use
movies; 
```

</div><div>

You can tell mongodb (when using mongosh or any other means of connection) that
[you want to use a database](https://www.mongodb.com/docs/v5.0/reference/mongo-shell/#command-helpers).

It does not, however, create it. More details ahead.

```sql
use
movies; 
```

</div></div>

### Creating tables/documents

<div class="comparison-box"><div>

Once you created you database and instructed mysql to use it, you can create a
table.

A table is a blueprint of your data. It defines how it looks like.

```sql
-- sample create table from https://github.com/bbrumm/databasestar
CREATE TABLE movie
(
    movie_id     INT NOT NULL AUTO_INCREMENT,
    title        VARCHAR(1000)  DEFAULT NULL,
    budget       INT            DEFAULT NULL,
    homepage     VARCHAR(1000)  DEFAULT NULL,
    overview     VARCHAR(1000)  DEFAULT NULL,
    popularity   DECIMAL(12, 6) DEFAULT NULL,
    release_date DATE           DEFAULT NULL,
    revenue      BIGINT(20) DEFAULT NULL,
    runtime      INT            DEFAULT NULL,
    movie_status VARCHAR(50)    DEFAULT NULL,
    tagline      VARCHAR(1000)  DEFAULT NULL,
    vote_average DECIMAL(4, 2)  DEFAULT NULL,
    vote_count   INT            DEFAULT NULL,
    CONSTRAINT pk_movie PRIMARY KEY (movie_id)
);
```

</div><div>

There is no such thing for mongodb.

Mongodb documents are free-form, therefore there is no direct equivalent on it.

Some projects tries to define some schema-ish types at application level, like
[Spring Data](https://spring.io/guides/gs/accessing-data-mongodb/#_define_a_simple_entity)
and [Mongoose](https://mongoosejs.com/docs/index.html), but in it's heart
mongodb doesn't care about blueprints.
</div></div>

### Relations between entities

<div class="comparison-box"><div>

During table definition you can refer to previously created tables and that way
define a relation between them. It can be done creating foreign keys:

```sql
CREATE TABLE movie_company
(
    movie_id   INT DEFAULT NULL,
    company_id INT DEFAULT NULL,
    CONSTRAINT fk_mc_comp FOREIGN KEY (company_id) REFERENCES production_company (company_id),
    CONSTRAINT fk_mc_movie FOREIGN KEY (movie_id) REFERENCES movie (movie_id)
);
```

</div><div>

There is no equivalent on mongodb.

It is possible, however, to perform
['joins' between collections](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/)
which results in similar output when building queries.

</div></div>

## Data ingestion

### Data dump/restore

When data volume is too high, both mysql and mongodb offer alternative ways to
handle data ingestion.

<div class="comparison-box"><div>

Data restoration in mysql can be done by redirecting a sql script from prompt.
It will restore all tables and data at once.

```bash
mysql -u root -ppassword -h localhost movies < movies.sql
```

</div><div>

Data restoration in mongodb must be done one collection at time.
There is a 16MB file size limit.

```bash
mongoimport --uri mongodb://localhost/movies \
  --authenticationDatabase=admin \ 
  --jsonArray --username root --password password \
  --collection movie --file movie.json 
```

</div></div>

For data exportation there is
[mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html) and
[mongoexport](https://www.mongodb.com/docs/database-tools/mongoexport/) with
similar behavior of their import counterparts.

### Insert

On both tools data insertion is pretty straigtforward:

<div class="comparison-box"><div>

```sql
INSERT INTO movie_crew
    (movie_id, person_id, department_id, job)
VALUES (285, 2445, 3, 'Producer');
```

</div><div>

```javascript
db.movie_crew.insertOne({
  movie_id: 285,
  person_id: 2445,
  department_id: 3,
  job: 'Producer'
})
```

</div></div>

### Delete

Deletion is also very clean:

<div class="comparison-box"><div>

```sql
delete
from movie_crew
where movie_id = 285
  and person_id = 2445;
```

</div><div>

```javascript
db.movie_crew.deleteOne({
  person_id: 2445,
  movie_id: 285
})
```

</div></div>

### Update

Data update also goes with no bigger hassle:

<div class="comparison-box"><div>

```sql
update movie_crew
set department_id = 9
where movie_id = 285
  and person_id = 2445;
```

</div><div>

```javascript
db.movie_crew.updateOne({
  person_id: 2445,
  movie_id: 285
}, {
  $set: {
    department_id: 9
  }
})
```

One quick note on mongo: its important to use the `$set` operator otherwise the
update operation will replace the selected document entirely.

More on mongo operators
[here](https://www.mongodb.com/docs/manual/reference/operator/).

</div></div>

## Queries

Find out information from your data.

### Select/Find

#### Full scan

<div class="comparison-box"><div>

MySQL:

```sql
select *
from movie;
```

</div><div>

MongoDB:

```javascript
db.movie.find({})
```

</div></div>

#### Specific movies given part of title

<div class="comparison-box"><div>

MySQL:

```sql
select *
from movie
where title like '%History%';
```

</div><div>

MongoDB:

```javascript
db.movie.find({title: /History/})
```

</div></div>

#### Movies given an actor

<div class="comparison-box"><div>

MySQL:

```sql
select *
from movie
where movie_id in (select movie_id
                   from movie_cast
                   where actor_id = 85);
```

</div><div>

MongoDB:

```javascript
// build a pipeline
db.movie.aggregate([
  {
    $lookup: {
      from: "movie_cast",
      localField: "movie_id",
      foreignField: "movie_id",
      as: "join_data"
    }
  },
  {
    $match: {
      "join_data.person_id": 85
    }
  }
])
```

_Note_: this is where data denormalization could benefit mongo. instead of query
across different collections, just duplicate data over the db.

This is also why some criticize so fiercely NoSQL databases.

A query under a denormalized document would be like this:

```javascript
db.movie.find({"movie_cast.person_id": 85})
```

Where `movie_cast` isn't a standalone collection anymore but a embedded one
inside the `movie` collection.

</div></div>

### Join tables/collections

Joining data helps to produce more relevant information.

Example, lets see the crew member names:

<div class="comparison-box"><div>

MySQL:

```sql
select * from person natural join movie_crew;
```

Note:

Natural joins differ from regular joins because they try to join tables by
matching every column with same name on both tables.

</div><div>

MongoDB:

```javascript
db.person.aggregate([
  {
    $lookup: {
      from: "movie_crew",
      localField: "person_id",
      foreignField: "person_id",
      as: "crew"
    }
  },
  {
    $match: {
      "crew": {
        $exists: true,
        $not: {
          $size: 0
        }
      }
    }
  }
])
```

Note:

_Again_ you must take care on how you model your schemaless data, since every
time you need to perform aggregations and lookups there will be a huge
performance cost.

</div></div>

## Advanced data manipulation

Build more complex information, data manipulation and some statistic queries on
your data.

### count / min / max

Aggregation functions helps to extract information from data.

Example, let's figure out how many actors are in the database:

<div class="comparison-box"><div>

MySQL:

```sql
select count(distinct person_id)
from movie_cast;
```

</div><div>

MongoDB:

```javascript
db.movie_cast.aggregate([
  {$group: {_id: '$person_id'}},
  {$count: 'count_distinct_person_id'}
])
```

</div></div>

Now let's figure out the movies with the biggest cast:

<div class="comparison-box"><div>

MySQL:

```sql
select title, count(person_id)
from movie_cast
         join movie on movie_cast.movie_id = movie.movie_id
group by title
order by count(person_id) desc
```

</div><div>

MongoDB:

```javascript
db.movie_cast.aggregate([
  {$group: {_id: '$movie_id', count: {$sum: 1}}},
  {$sort: {"count": -1}}
])
```

This is the closest possible query. Denormalize for better results.

</div></div>

### Views

Conceptually speaking, Views are a specific way to select data from the
databases that are so common that there is this formalized way to do that
without all the heavy-lifting of a complex join query.

<div class="comparison-box"><div>

In mysql a view can be declared like this:

```sql
create
or replace view 
    vw_movies_count_cast 
as
select m.*,
       mc.*
from movie m
         join
     movie_cast mc on m.movie_id = mc.movie_id
```

</div><div>

There are views in mongodb, and you can declare them like this:

```javascript
db.createView(
  "movie_count_cast",
  "movie",
  [
    {
      $lookup: {
        from: "movie_cast",
        localField: "movie_id",
        foreignField: "movie_id",
        as: "cast"
      }
    }
  ]
)
```

</div></div>

## Conclusion

This is just a fast ride on Relational vs non-relational databases and there is
much left out of this guide.

For instance, mongo will beat mysql on every single direct query not involving
`$lookups` into other collections. When it needs to do that, mysql beats mongo
every time.

The key lesson here remains: **mind your data moddeling even if it's schemaless**.

Happy Hacking.

## References

- <https://github.com/bbrumm/databasestar>
- <https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/>
- <https://stackoverflow.com/a/23761146/420096>
- <https://www.mongodb.com/docs/database-tools/mongoimport/>
- <https://stackoverflow.com/a/68937584/420096>
- <https://stackoverflow.com/questions/51148744/mongoose-filter-collection-based-on-values-in-another-collection>
- <https://stackoverflow.com/questions/67685137/how-do-i-set-show-more-than-20-results-in-intellij-datagrip-mongo-db-shell>
- <https://www.mongodb.com/docs/manual/tutorial/query-arrays/>
- <https://www.mongodb.com/docs/manual/reference/method/db.collection.count/>

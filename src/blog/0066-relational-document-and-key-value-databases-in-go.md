---
layout: blog-layout.pug
tags:
  - posts
  - database
  - sql
  - document
  - key-value
  - golang
date: 2024-02-12
draft: false
---
# Relational, Document and Key/Value Databases In Go

It's more about the databases than Go, but the samples are in Go, so

## Relational database

The proper way to model, store and query data. The sql language is standardized
by [ISO 9075][10] and the language was based in a theory field called
[relational algebra][20] and the structures can be better organized by the
[normal forms][30]

SQL database implementations usually also offers [ACID properties][40] and excel
offering reliable, flexible and correct information extracted from stored data.

### Notable SQL databases

- [PostgreSQL](https://bing.com?q=postgresql)
- [Oracle](https://bing.com?q=oracle)
- [MySQL](https://bing.com?q=mysql)
- [SQLite](https://bing.com?q=sqlite)
- [DB2](https://bing.com?q=db2)
- [H2](https://bing.com?q=h2%20database%20engine)

The following sample creates a table in a relational database ([sqlite][50]):

```go
func GetConnection() *sql.DB {
 fmt.Println("get connection for relational database")

 db, err := sql.Open("sqlite3", "./todo.db")
 if err != nil {
  log.Fatal(err)
 }

 init := `
  create table if not exists todo(
      id integer primary key autoincrement, 
      description text, 
      done boolean, 
      created timestamp, 
      updated timestamp
  );
 `

 _, _ = db.Exec(init)

 return db
}
```

It's possible to store data this way:

```go
func Insert(db *sql.DB, todo *model.Todo) int64 {

 result, _ := db.Exec(`
  insert into todo (description,done,created,updated)
  values(?,?,?,?)
 `, todo.Description, todo.Done, todo.Created, todo.Updated)

 id, _ := result.LastInsertId()

 return id
}
```

Check the full source code [here][60].

## Document-based database

This kind of database takes a different approach and instead of tables and
schemas we have just [documents][70].

Schemaless documents are easier to evolve, assuming that data has a fluid nature
it copes well with such changes.

I also do some other compromises, like the [eventual consistency][80] instead of
ACID properties from a relational database.

Denormalization is not a key feature on document databases but it's pretty
common practice.

This kind of database became quite popular in early 2000 decade, when internet
applications started to suffer from database bottlenecks and everyone started to
blame relational databases. The term [NoSQL][90] became a thing, although it
goes re-branded as "Not Only SQL" nowadays.

### Notable document-based databases

- [MongoDB](https://bing.com?q=mongodb)
- [Firestore](https://bing.com?q=firestore)
- [Clover](https://bing.com?q=clover%20document%20database)

The following sample code creates a connection with a document database and
stores a value:

```go

func GetConnection() *c.DB {
 fmt.Println("get connection for document-based database")

 db, err := c.Open("todo-doc")
 if err != nil {
  log.Panic(err)
 }

 _ = db.CreateCollection("todos")
 return db
}

func Insert(db *c.DB, todo *model.Todo) string {
 todo.Id = todo.Created.Unix() // It's an insert
 doc := c.NewDocumentOf(todo.ToMap())
 id, _ := db.InsertOne("todos", doc)
 return id
}
```

Check the full source code [here][60].

## Key/Value database

This kind of database is simpler and has a different approach on retrieving data
stored: instead of query columns or properties, all you can query is the keys.
Data itself is opaque and the keys are supposed to be rich enough to perform
detailed queries of what is needed.

This limitation usually comes with performance gains.

Usually, key/value databases goes with document-databases regarding ACID
properties, but it's not a rule. It's also common to get mistakenly a key/value
database as a document database because both are schemaless and some
implementations of key/value also offers ways to query documents inside values.

### Notable key/value databases

- [Redis](https://bing.com?q=redis)
- [Cassandra](https://bing.com?q=cassandra)
- [LevelDB](https://bing.com?q=leveldb)

The following sample code creates a connection with a key/value database and
stores a value:

```go

func GetConnection() *leveldb.DB {
 fmt.Println("get connection for key/value database")
 db, err := leveldb.OpenFile("todo-kv", nil)
 if err != nil {
  log.Panic(err)
 }
 return db
}

func Insert(db *leveldb.DB, todo *model.Todo) int64 {
 todo.Id = todo.Created.Unix()
 _todo, _ := json.Marshal(todo)
 _ = db.Put([]byte(todo.Created.Format(time.RFC3339)), _todo, nil)
 return todo.Id
}
```

Check the full source code [here][60].

## Which one is better

It depends of your needs.

Key/Value ones are great for time-series or big throughput of data to be
analyzed later.

Document, highly available, databases also are good for big data volumes and if
it's ok some data loss either by data volume or eventual document evolution.

If you care about the data and it's not ok to suffer any data loss, or if you
plan to extract some intelligence, some information from the data then you get
a full-featured relational database, it will make the task easier.

## Conclusion

When it comes to choose the right database keep in mind that it's not an
exclusive choice.

Most real-world mission-critical systems often employs more than one of these
technologies to perform distinct jobs.

So, make sure to choose wisely which database will solve which problem.

Happy hacking!

[10]: https://en.wikipedia.org/wiki/ISO/IEC_9075
[20]: https://en.wikipedia.org/wiki/Relational_algebra
[30]: https://en.wikipedia.org/wiki/Database_normalization
[40]: https://en.wikipedia.org/wiki/ACID
[50]: https://www.sqlite.org
[60]: https://github.com/sombriks/my-golang-handbook/tree/main/exercises/0013-databases
[70]: https://www.mongodb.com/docs/manual/introduction/
[80]: https://en.wikipedia.org/wiki/Eventual_consistency
[90]: https://en.wikipedia.org/wiki/NoSQL

---
layout: blog-base.webc
tags: 
  - posts
  - sql
  - go
  - gorm
  - ent
date: 2022-03-28
---
# gorm versus ent: which ORM you should choose when going to go land

This is a quite opinionated one, and you can see the approaches here:

- [gorm](https://github.com/sombriks/rosetta-beer-store/tree/master/beer-store-service-go-martini-gorm)
- [ent](https://github.com/sombriks/rosetta-beer-store/tree/master/beer-store-service-go-gin-ent)

## gorm maps with metadata

If you like ORM approaches like JPA, Sequelize or rails Active records, then
this one is your deal.

You map your entity:

```go
package model

import (
 "time"
)

type Beer struct {
 Idbeer           int64      `json:"idbeer,omitempty" gorm:"column:idbeer;primary_key"`
 Titlebeer        string     `json:"titlebeer,omitempty" gorm:"column:titlebeer"`
 Descriptionbeer  string     `json:"descriptionbeer,omitempty" gorm:"column:descriptionbeer"`
 Creationdatebeer *time.Time `json:"creationdatebeer,omitempty" gorm:"column:creationdatebeer"`
 Idmedia          *int       `json:"idmedia,omitempty" gorm:"column:idmedia"`
}

func (Beer) TableName() string {
 return "beer"
}
```

And then query it:

```go
// see full example in repos
beers := []model.Beer{}
db.Table("beer").Where("titlebeer like ?", search).Offset((p - 1) * s).Limit(s).Find(&beers)
```

## ent generates code to give you type-safe queries

You start mapping your entities like a regular Tuesday:

```go
// folder rosetta-beer-store/beer-store-service-go-gin-ent/service/models/schema
package models

import (
 "entgo.io/ent"
 "entgo.io/ent/dialect/entsql"
 "entgo.io/ent/schema"
 "entgo.io/ent/schema/field"
)

type Beer struct {
 ent.Schema
}

func (Beer) Annotations() []schema.Annotation {
 return []schema.Annotation{
  entsql.Annotation{Table: "beer"},
 }
}

// https://github.com/ent/ent/issues/127#issuecomment-573030359
func (Beer) Fields() []ent.Field {
 return []ent.Field{
  field.Int("id").StorageKey("idbeer"),
  field.Time("creationdatebeer"),
  field.String("titlebeer"),
  field.String("descriptionbeer"),
  field.Int("idmedia"),
 }
}
```

Note the folder location in project; this is important for ent.

Before we can query our database using ent, we **must** generate the client code
with this command:

```bash
go run -mod=mod entgo.io/ent/cmd/ent generate ./service/models/schema
```

It will create a bunch of code with helpers to make near impossible to perform
any invalid query. I mean, look at that:

```go
beers, _ := client.Beer.Query().Where(
  beer.Or(
   beer.TitlebeerContainsFold(search),
   beer.DescriptionbeerContainsFold(search),
  ),
 ).Offset((page - 1) * pageSize).Limit(pageSize).All(context.TODO())
```

when i say that ent codegen game is strong i am serious. Run the sample projects
yourself and see.

## okay but which oe is better

It depends on how comfortable are you in regenerating code with ent. And how
much are you willing to embrace it quite entirely, since it also can become your
migration system too. On the other hand, if you came from a JPA or rails/active
record background, gorm will be way more friendly.

## further reading

I really just scratched the go ecosystem surface here.

If you got hooked, take a look at more curated lists over the lang, like
[this one](https://awesome-go.com/).

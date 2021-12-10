# spring boot java database migrations with liquibase and sql

I really enjoy database migrations.

From java land, people tend to recommend flyway because it's more flexible and
allows you to use sql files to create migration files.

But liquibase does that too, see!

## maven dependencies

You can use [spring initializr](https://start.spring.io/) to create a fair
template with the following dependencies:

- liquibase
- data-jpa
- web
- mariadb driver
- lombok

## configuring liquibase

The file `application.properties` will look like this:

```ini
# spring configuration

# datasource
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.url=jdbc:mariadb://localhost:3306/sample-liquibase

# liquibase
spring.liquibase.change-log=db/changelog.xml
```

Liquibase itself has it's own file, `liquibase.properties`:

```ini
changeLogFile = db/changelog.xml
driver = org.mariadb.jdbc.Driver
url = jdbc:mariadb://localhost:3306/sample-liquibase
verbose = true
dropFirst = false
username = root
password = root
logLevel = debug
```

Doubled configuration will allow you to use liquibase without spring boot if
necessary.

## set up migrations

create a folder inside *resources* called *db*. The *changelog.xml* file pointed
out in previous liquibase configurations will be inside that, and will look like
this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:pro="http://www.liquibase.org/xml/ns/pro"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
    http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd
    http://www.liquibase.org/xml/ns/pro 
    http://www.liquibase.org/xml/ns/pro/liquibase-pro-3.8.xsd">
    <includeAll path="changelogs" relativeToChangelogFile="true"/>
</databaseChangeLog>
```

Now things get interesting because usually people complains about liquibase
because migration files are ugly xml, json or - even worse - yaml files.

Thanks to the
[includeAll option](https://docs.liquibase.com/concepts/advanced/includeall.html),
you can set a path to a folder and inside that folder all changesets can be in
the sql format. Something like this:

```sql
-- liquibase formatted sql
-- changeset sombriks:2021-07-13-17-31-01_create-table-pets.sql
create table pets(
    id integer not null primary key auto_increment,
    name varchar(255) not null
);
-- rollback drop table pets;
```

As you can see, the file is complete valid sql, but there is a catch:

The two first comments are mandatory.

The first one MUST be `-- liquibase formatted sql`.

The second one is in `-- changeset <username>:<unique-identifier>` format.

The final one you can add a rollback command, the `-- rollback` comments can
expand for many lines.

The files are read in alphabetical order therefore is a good call to timestamp
them.

Note: you can have more than one changeset per file. which is good to assure
some transactional consistency on older databases.

## make sql templates easily

Create those files in the proper name and format can be a bit boring, so you can
make a small script to ease the creation of those files:

```bash
# makemigrate.sh
# helper script to create new migrate file
# place it into project root (same level as your src folder)
NEW_MIGRATE="$(date '+%Y-%m-%d-%H-%M-%S')_$1.sql"
echo "New file created:
src/main/resources/db/changelogs/$NEW_MIGRATE
"

cat << EOF > src/main/resources/db/changelogs/$NEW_MIGRATE
-- liquibase formatted sql
-- changeset $USER:$NEW_MIGRATE
create table pets(
    id integer not null primary key auto_increment,
    name varchar(255) not null
);
-- rollback drop table pets;
EOF
```

That way you can create migrate files with the following command:

```bash
./makemigrate.sh create-pet-table
```

## that's it

It's quite nice to see how flexible liquibase is, and if you need to see this
example with more details, the source code is available
[here](https://github.com/sombriks/sample-liquibase).

2021-07-13

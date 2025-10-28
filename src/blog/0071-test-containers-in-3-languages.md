---
layout: blog-layout.pug
tags:
  - posts
  - node
  - kotlin
  - golang
  - project structure
  - docker
  - docker compose
  - koa
  - spring-boot
  - echo
  - jpa
  - knex
  - goqu
  - sql
  - ava
  - junit
  - testify
  - testcontainers
  - recipes
  - test
  - webjars
  - htmx
  - alpinejs
  - thymeleaf
  - pug
  - gomponents
  - github actions
date: 2024-06-25
draft: false
---
# How to use TestContainers to extend test boundaries

Samples on why and how to use [TestContainers][testcontainers]

## Test Boundaries

Untested code is a dark jungle filled with unknown bugs.

We write tests to light up a fire to keep unexpected problems away.

But how far a test suite should go?

It's clear that any business-specific code must be covered with tests, but does
a 3rd party API endpoint should be tested too? And the database?

There are [frontiers][test-boundaries]. Anything out of our control can not be
properly tested.

And this is the crossroads: expand our control or mock boundaries.

## The problem with too much mocks

Don't get me wrong, mocks at the boundaries works. But as advised by Mockito's
[front page project][mockito], _don't mock everything_.

For example, this mock looks perfectly reasonable:

```kotlin
// mock to list data - ok
@BeforeEach
fun setup() {
    _when(
        personRepository.findByNameContainingIgnoreCase(
            anyString(), anyOrNull()
        )
    ).thenReturn(personPage)
}

@Test
fun `should list people`() {
    val result = boardService.listPeople("", pageable)
    assertThat(result, notNullValue())
}
```

But then:

```kotlin
// mock to insert - fail
@Test
@Disabled("We can keep mocking but we don't trust the test anymore")
fun `should save people`() {
    val person = Person(name = "Ferdinando")
    boardService.savePerson(person)
    assertThat(person.id, notNullValue()) //new person should have an id now
}
```

In this situation, you could simply keep growing the mock surface but there will be
a point when you will be testing nothing at all.

To really solve it, your boundaries must expand. And if the boundary to expand
is the database, [here goes some samples][repo].

## Introducing TestContainers

One way to test the database is to use some lightweight database runtime like
[h2][h2] or [sqlite][sqlite], but that comes with a price: the database dialect
might be different from the real deal, therefore you must be cautious about how
you write your queries.

To properly avoid that, it's ideal to use same RDBMS for development, staging
and for testing.

Using TestContainers makes this task a real easy breeze.

### The sample kanban application, not a todo list

In the [sample repository][repo] you can check a (kinda draft of) kanban app.
It's implemented with a mix of backend and frontend technologies:

- [htmx.org][htmx]
- [alpine.js][alpinejs]
- [bulma.css][bulma]
- [ionicons][ionicons]

This frontend selection tries to achieve simplicity, avoiding some frontend
tooling we usually pick for current solutions, but it won't be focus of this
article.

## Testing the database

Whenever we need to "test the database", what we're really testing is a
[known database state][db-state]. We expect a certain user/password to be
accepted; we expect a certain schema and a set of tables to exists. We expect
some data to be present.

Therefore, when spinning up a test suite involving relational data, some setup
is needed. And TestContainers offers goodies to be used exactly in that phase.

### Sample code - Spring/Kotlin/JUnit

Spring tests has not only the setup phase but also The
[@TestConfiguration stereotype][spring-test-configuration], so the DI container
does all the heavy-lifting for you:

```kotlin
package sample.testcontainer.kanban

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.context.annotation.Bean
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

    @Value("\${database}")
    private lateinit var database: String
    @Value("\${spring.datasource.username}")
    private lateinit var username: String
    @Value("\${spring.datasource.password}")
    private lateinit var password: String

    @Bean
    @ServiceConnection
    fun postgresContainer(): PostgreSQLContainer<*> {
        return PostgreSQLContainer(
            DockerImageName
                .parse("postgres:16.3-alpine3.20")
        ).withEnv(
            mapOf(
                "POSTGRES_DB" to database,
                "POSTGRES_USER" to username,
                "POSTGRES_PASSWORD" to password
            )
        ).withInitScript("./initial-state.sql")
    }

}
```

This configuration should be "imported" into the test case so the default
database configuration, which probably won't be present in a CI workflow, can be
replaced in a transparent way. Someone at TestContainers team indeed made a fine
work on this craft:

```kotlin
package sample.testcontainer.kanban

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import

@SpringBootTest
// just add that and you have a full-featured, predictable, database for test!
@Import(TestcontainersConfiguration::class)
class SampleKanbanJvmApplicationTests {

 @Test
 fun contextLoads() {
 }

}
```

#### Noteworthy on jvm version

- Project is mostly automatically generated by [spring initializr][initializr]
- Unlike node or go versions, due to how classpath works, the init script for
  the database must be in test/resources folder.
- Keep compose database and test container database with similar state can be
  tricky, but the easiest way to do it is to use [the same init script][sql].
- Don't forget to [import][spring-config-import] the spring test configuration
  into your test via `@Import` annotation otherwise the test will simply search
  for the database using the regular configuration instead of the TestContainer.
- Mockito still present issues with kotlin. The `mockito-kotlin` dependency is
  there just to solve that.
- The [layout dialect for thymeleaf][layout] delivers important feature on view
- design which, in my opinion, should be part of the main thing.
- On the other hand, whenever a development error happens, (i.e. forgot to feed
  proper data in spring mvc model), thymeleaf fails to deliver the correct
  faulty template name, lost itself in the include maze that can form very
  quickly when we go through this pages and components path.
- LiveReload looks like a forgotten art. On eclipse, it just was there, working.
  But with [some research][thm-live-reload] and
  [proper configuration][dev-profile], it can be somewhat restored.
- [Alpine.js][alpinejs] remembers the simplicity of original Angular.js, but
  it's much more like Vue.js. That's a good thing.
- Controller routes for pages and for components are a thing under evaluation.
  It helps even more if the pages are built with components. Proper and wise ids
  attributions are a paramount strategy in this scenario, and i think it helps
  with e2e tests. Still experimenting.
- Since there is no need to serialize JPA entities to json or something like
  that, bidirectional mappings are back, so back! But mind the proper mapping
  and the correct use of `mappedBy`, otherwise JPA will produce invalid queries
  trying to violate database constraints.

[testcontainers]: https://testcontainers.com/
[bulma]: https://bulma.io/documentation/
[htmx]: https://htmx.org/docs/#introduction
[initializr]: <https://start.spring.io/#!type=gradle-project-kotlin&language=kotlin&platformVersion=3.3.0&packaging=jar&jvmVersion=17&groupId=sample.testcontainer&artifactId=kanban&name=sample-kanban-jvm&description=Demo%20project%20for%20Spring%20Boot%2C%20Kotlin%20and%20TestContainers&packageName=sample.testcontainer.kanban&dependencies=web,testcontainers,postgresql,thymeleaf,data-jpa>
[sql]: https://github.com/sombriks/sample-testcontainers/blob/main/sample-kanban-jvm/src/test/resources/initial-state.sql
[spring-config-import]: https://github.com/sombriks/sample-testcontainers/blob/main/sample-kanban-jvm/src/test/kotlin/sample/testcontainer/kanban/services/BoardServiceTestWithTestContainers.kt
[layout]: https://ultraq.github.io/thymeleaf-layout-dialect/getting-started/
[thm-live-reload]: https://attacomsian.com/blog/spring-boot-auto-reload-thymeleaf-templates
[dev-profile]: https://github.com/sombriks/sample-testcontainers/blob/main/sample-kanban-jvm/src/main/resources/application-dev.properties
[alpinejs]: https://alpinejs.dev

Now let's jump to the next sample.

### Sample code - Koa/Knex/Ava

Ava has hooks where you can properly set up and tear down the database. Update
[database configuration][node-tc] accordingly:

```javascript
// in app/configs/hook-test-container.js
import {resolve} from 'node:path';
import {PostgreSqlContainer} from '@testcontainers/postgresql';

/**
 * Helper to provision a postgresql for testing purposes
 *
 * @returns {Promise<StartedPostgreSqlContainer>} database container
 */
export const preparePostgres = async () => new PostgreSqlContainer('postgres:16.3-alpine3.20')
  .withDatabase(process.env.PG_DATABASE)
  .withUsername(process.env.PG_USERNAME)
  .withPassword(process.env.PG_PASSWORD)
  .withBindMounts([{
    source: resolve(process.env.PG_INIT_SCRIPT),
    target: '/docker-entrypoint-initdb.d/init.sql',
  }])
  .start();
```

A quick note, but the node postgresql container has a distinct idiom for the
initial script when compared with jvm or golang versions. Those have a
`withInitScript` builder call, while node version offer a more generic
`withBindMounts` call.

You then integrate the test container provisioning into your [ava][ava] test
like this:

```javascript
// in app/app.spec.js
import request from 'supertest';
import test from 'ava';
import {prepareApp} from './main.js';
import {prepareDatabase} from './configs/database.js';
import {boardServices} from './services/board-services.js';
import {boardRoutes} from './routes/board-routes.js';
import {preparePostgres} from './configs/hook-test-container.js';

test.before(async t => {
 // TestContainer setup
 t.context.postgres = await preparePostgres();

 // Application setup properly tailored for tests
 const database = prepareDatabase(t.context.postgres.getConnectionUri());
 const service = boardServices({db: database});
 const controller = boardRoutes({service});

 const {app} = prepareApp({db: database, service, controller});

 // Context registering for proper teardown
 t.context.db = database;
 t.context.app = app;
});

test.after.always(async t => {
 await t.context.db.destroy();
 await t.context.postgres.stop({timeout: 500});
});

test('app should be ok', async t => {
 const result = await request(t.context.app.callback()).get('/');
 t.is(result.status, 302);
 t.is(result.headers.location, '/board');
});

test('db should be ok', async t => {
 const {rows: [{result}]} = await t.context.db.raw('SELECT 1 + 1 as result');
 t.truthy(result);
 t.is(result, 2);
});

test('should serve login and have users', async t => {
 const result = await request(t.context.app.callback()).get('/login');
 t.is(result.status, 200);
 t.regex(result.text, /Alice|Bob|Caesar|Davide|Edward/);
});
```

Mind to write proper testable code: it's very tempting to just create and export
your objects directly from modules:

```javascript
// in app/configs/views.js
import {resolve} from 'node:path';
import Pug from 'koa-pug';

export const pug = new Pug({
  viewPath: resolve('./app/templates'),
});
```

It's pretty fine most of the time, templates directory isn't likely to become a
configurable thing, so it's ok.

But for proper testing you must provide inversion of control, dependency
inversion, the **D** in _[SOLID][solid]_. this is a good way to provision a
[knex][knex] query builder instance:

```javascript
// in app/configs/database.js
import Knex from 'knex';

export const prepareDatabase = (connection = process.env.PG_CONNECTION_URL) => Knex({
  client: 'pg',
  connection,
});
```

The `prepareDatabase` call let us send any connection string we want for the
database, quite useful when we are spinning up a postgres container, but if none
is provided it will rely on what we have configured in the environment under the
`PG_CONNECTION_URL` variable.

Besides that implementation detail, everything else should work under test the
same way it works during development or in production. same code, no mocks, same
database engine, same dialect, same thing.

#### Noteworthy on node version

- Small but important reminder, [this code is quite experimental][repo] and aims
  to showcase testcontainers, not the best Node.js practices. You where warned!
- Unlike _modern_ frontend development, we don't have a build step for code that
  runs on client-side. We're avoiding, however, download pure frontend artifacts
  and serve them as assets, because we might lose track of our dependencies,
  managed by npm. In spring version, there was [webjars][webjars], so we did a
  similar approach using [koa-static][koa-static] and [koa-mount][koa-mount].
- [Koa][koa]'s simplicity always amazes me. This is what express was supposed to
  be. Modular. Extensible. Easy to test.
- Thanks to [xo][xo] we have a simple way to have some code quality _standards_.
  Direct eslint configuration is quite unbearable and [other linter][standard]
  alternatives seems too strict.
- TestContainer setup is quite similar to what we saw on jvm version; it has,
  however, a distinct idiom to provide the init.sql script needed to create a
  known state in the database.
- Always remember that everything that executes in a node project has the point
  of execution, entrypoint, you name it, in the same folder as the package.json,
  the project root in other words. This is why in the `.withBindMounts` call the
  path to sql script in the other project jumps just one folder up and not two.
  This is why `koa-static` doesn't need to jump up no folder when mapping the
  frontend libs in _node_modules_.

[koa]: https://koajs.com
[knex]: https://knexjs.org
[xo]: https://github.com/xojs/xo
[ava]: https://avajs.dev/
[standard]: https://standardjs.com/
[webjars]: https://www.webjars.org/
[koa-static]: https://www.npmjs.com/package/koa-static
[koa-mount]: https://www.npmjs.com/package/koa-mount

### Sample code - Echo/Goqu/Testify

[Testify][testify] offers setup hooks where you can provision and later release the
database runtime.

```go
package services

import (
 "context"
 "fmt"
 "github.com/doug-martin/goqu/v9"
 "github.com/joho/godotenv"
 "github.com/sombriks/sample-testcontainers/sample-kanban-go/app/configs"
 "github.com/stretchr/testify/suite"
 "github.com/testcontainers/testcontainers-go"
 "github.com/testcontainers/testcontainers-go/modules/postgres"
 "github.com/testcontainers/testcontainers-go/wait"
 "testing"
 "time"
)

type ServiceTestSuit struct {
 suite.Suite
 ctx     context.Context
 tc      *postgres.PostgresContainer
 db      *goqu.Database
 service *BoardService
}

// TestRunSuite when writing suites this is needed as a 'suite entrypoint'
// see https://pkg.go.dev/github.com/stretchr/testify/suite
func TestRunSuite(t *testing.T) {
 suite.Run(t, new(ServiceTestSuit))
}

func (s *ServiceTestSuit) SetupSuite() {
 var err error
 // Test execution point is inside the package, not in project root
 _ = godotenv.Load("../../.env")

 s.ctx = context.Background()

 props, err := configs.NewDbProps()
 if err != nil {
  s.Fail("Suite setup failed", err)
 }
 s.tc, err = postgres.RunContainer(s.ctx,
  testcontainers.WithImage("postgres:16.3-alpine3.20"),
  postgres.WithInitScripts(fmt.Sprint("../../", props.InitScript)), // path changes due test entrypoint
  postgres.WithUsername(props.Username),
  postgres.WithDatabase(props.Database),
  postgres.WithPassword(props.Password),
  testcontainers.WithWaitStrategy(wait.
   ForLog("database system is ready to accept connections").
   WithOccurrence(2).
   WithStartupTimeout(10*time.Second)))
 if err != nil {
  s.Fail("Suite setup failed", err)
 }

 dsn, err := s.tc.ConnectionString(s.ctx, fmt.Sprint("sslmode=", props.SslMode))
 if err != nil {
  s.Fail("Suite setup failed", err)
 }

 s.db, err = configs.NewGoquDb(nil, &dsn)
 if err != nil {
  s.Fail("Suite setup failed", err)
 }

 s.service, err = NewBoardService(s.db)
 if err != nil {
  s.Fail("Suite setup failed", err)
 }

}

func (s *ServiceTestSuit) TearDownSuite() {
 err := s.tc.Terminate(s.ctx)
 if err != nil {
  s.Fail("Suite tear down failed", err)
 }
}

// the test cases
```

Similar to the advice given on node version, mind the configuration phase! Your
code is supposed to offer reasonable defaults and proper dependency injection so
you can provide test values or production values whenever needed:

```go
package configs

import (
 "database/sql"
 "fmt"
 "github.com/doug-martin/goqu/v9"
 _ "github.com/doug-martin/goqu/v9/dialect/postgres"
 _ "github.com/lib/pq"
 "log"
)

// NewGoquDb - provision a query builder instance
func NewGoquDb(d *DbProps, dsn *string) (*goqu.Database, error) {
 var err error
 if d == nil {
  log.Println("[WARN] db props missing, creating a default one...")
  d, err = NewDbProps()
 }

 // configure the query builder
 if dsn == nil {
  newDsn := fmt.Sprintf("postgresql://%s:%s@%s:5432/%s?sslmode=%s", //
   d.Username, d.Password, d.Hostname, d.Database, d.SslMode)
  dsn = &newDsn
 } else {
  log.Printf("[INFO] using provided dsn [%s]\n", *dsn)
 }
 con, err := sql.Open("postgres", *dsn)
 if err != nil {
  return nil, err
 }
 // https://doug-martin.github.io/goqu/docs/selecting.html#scan-struct
 goqu.SetIgnoreUntaggedFields(true)
 db := goqu.New("postgres", con)
 db.Logger(log.Default())

 return db, nil
}
```

The sample above is called during configuration phase to provision the query
builder instance; it receives, however, optional parameters that allow us to set
appropriate values for development, test or production.

#### Noteworthy on go version

- The project structure is [not idiomatic to go][go-project-structure] but
  follows [SOLID][solid] standards as much as possible. It's a deliberate choice
  because go documented recommendation is a bad design and can lead quickly to
  mental fatigue. In fact [i blame Rob Pike][because] for this.
- Thanks to [godotenv][godotenv], we have an environment-aware configuration
  strategy almost as flexible as the jvm version.
- GO packages are very different from classpath or node ESM/CJS. For instance,
  they are their own point of execution, so the project root is not what you
  expect it to be.
- Like the node version, we're not using any [DI container][di] in this sample.
  Because of that, mind you configuration phase, write testable code, provide as
  much inversion of control points as possible while providing reasonable
  default values.
- [goqu][goqu] query builder resembles [knex][knex] query builder a little and,
  just like we did on node project, it's up to us solve the select [N+1][n+1]
  cases, which affects mainly the `task` and `message` models.
- Unlike other two projects, the template language isn't a markup language but
  golang itself. The [gomponents][gomponents] library isn't exactly a new idea,
  but looks funny see how it goes in this exercise. For instance, more type
  safety, richer helper functions and the ability to plan a breakpoint in the
  middle of the template are big and welcome benefits.
- Another discrepancy of this implementation is the use of static resources to
  serve unversioned frontend libraries. In jvm version there where
  [webjars][webjars], in node version we served versioned libraries directly
  from [node_modules][node_modules], but nothing similar is available for go
  projects by the time of this writing.
- Note that `//go:embed static` and `// go:embed static` are not the same thing.
- There is a tool called [air][air] that delivers similar experience on go
  projects that [nodemon][nodemon] delivers on node projects. It's completely
  optional and independent of project dependencies but it worth the
  configuration effort.
- Quick reminder that [go's range iterating over slices][range] returns the
  index and a **value**, not a _reference_ to the element being iterated.

[goqu]: https://github.com/doug-martin/goqu
[gomponents]: https://www.gomponents.com/
[testify]: https://github.com/stretchr/testify
[godotenv]: https://github.com/joho/godotenv
[air]: https://github.com/air-verse/air
[go-project-structure]: https://go.dev/doc/modules/layout
[solid]: https://en.wikipedia.org/wiki/SOLID
[di]: https://martinfowler.com/articles/injection.html
[n+1]: https://stackoverflow.com/a/39696775/420096
[node_modules]: https://docs.npmjs.com/cli/v7/configuring-npm/folders#node-modules
[nodemon]: https://nodemon.io/
[range]: https://gobyexample.com/range
[because]: https://github.com/robpike/filter

## CI/CD integration

Now the best part: most CI/CD infrastructure available out there will offer
docker runtimes, so your tests will run smoothly with dead simple workflows:

```yml
name: Node CI
on:
  push:
    branches: [main]
  workflow_dispatch:
defaults:
  run:
    working-directory: ./sample-kanban-node
jobs:
  run-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ./sample-kanban-node/package.json
      - run: npm ci
      - run: npm run test
```

You can check the others [workflow][ci-jvm] [files][ci-go], but they're pretty
the same thing.

## Conclusion

Now that your boundaries got extended, your confidence on the code grows more
and more. It does what it's supposed to do. It saves and list the expected
content. It works*. At least as far as the tests can tell.

[The complete source code can be found here][repo].

Happy hacking!

[repo]: https://github.com/sombriks/sample-testcontainers
[test-boundaries]: https://dzone.com/articles/defining-test-boundaries-an-example-simple-oriente
[mockito]: https://site.mockito.org/#more
[h2]: https://h2database.com/html/main.html
[sqlite]: https://www.sqlite.org/index.html
[db-state]: https://github.com/sombriks/sample-testcontainers/blob/main/sample-kanban-jvm/src/test/resources/initial-state.sql
[spring-test-configuration]: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html#testing.spring-boot-applications.detecting-configuration
[ionicons]: https://ionic.io/ionicons
[node-tc]: <https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/>
[ci-jvm]: https://github.com/sombriks/sample-testcontainers/blob/main/.github/workflows/jvm.yml
[ci-go]: https://github.com/sombriks/sample-testcontainers/blob/main/.github/workflows/go.yml

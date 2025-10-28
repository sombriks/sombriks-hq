---
layout: blog-layout.pug
tags:
  - posts
  - htmx
  - sql
  - h2
  - jdbi
  - kotlin
  - javalin
  - velocity
  - jacoco
  - spock
date: 2024-02-17
draft: false
---
# You should try htmx on your next project

I'm serious.

## Why?

Short answer, frontend isn't complex, just [got][000] [too][001] [complex][002]
[solutions][003]. With [htmx][004], we use a solution for the frontend and get
the same result, but with less complexity.

## This isn't just another framework, it's a philosophy

The key argument behind [htmx][004] is to augment hypertext documents (a.k.a.
[HTML][005]) in a way that they become fully capable of fulfill, in a
declarative way, the [Hyper Text Transfer Protocol][006], best known as HTTP.

### And what does that mean?

Classic HTML interacts with other HTTP resources either via [anchor links][007],
[formularies][008] or rely on explicit javascript code. Only via javascript is
possible to use [all verbs described in the protocol][009].

So, [htmx][004] changes that and make all HTTP verbs available for html
documents as attributes, and behaviors that where only possible with javascript
imperative code as well, like update only a small part of the document.

The _hello world_ is pretty straightforward:

```html
<button hx-post="/clicked"
    hx-trigger="click"
    hx-target="#parent-div"
    hx-swap="outerHTML">
    Click Me!
</button>
```

This triggers a post request to a `/clicked` endpoint when the html button is
clicked and replaces the element which id is `parent-div`.

Yes, there is javascript behind the scenes, but the entire behavior is coded in
a declarative way. It changes everything.

## A return to the innocence, but it's the state of the art

[In the beginning][010], server where responsible for create dynamic content and
served the resulting document to the browser. Life was simple.

Then [dynamic hypermedia became a thing][011] and they called it [AJAX][012].
Partial updates in a document shifted how we interacted with the internet
forever.

The growing complexity drifted the hypertext nature from document to application
and that demanded [new technologies][013] able to handle those needs. Web
applications became more and more self-sufficient, demanding less rendering
efforts from servers, engaging [more][014] [sophisticated][015] build systems.
The [SPA][016] became the standard for web apps and [MVVM][017] was the design
pattern to apply everywhere.

Application performance became a big concern and [new][000] [technologies][001]
[emerged][018] to solve this. There was also the [JAMSTACK][019] age, where some
original characteristics from hypertext, like multiple documents and
[proper SEO][020], got attention. Frontend development grew even more complex.

Then [server side rendering][021], [server components][022] and [islands][023]
connected the complex frontend stacks into servers again, bringing back the
role of user interface construction back to server-side. But it got completely
integrated with those [modern][024] [front-end][002] [tools][025].

This is the scenario where [htmx][004] emerges. It does exactly the same what
those state of the art, vanguard frontend technologies does, but ditches off
complexities like bundle building, tree-shaking unused dependencies and very
convoluted ways of transform [JSON][026] data into a dynamic document.

## What really is a REST service

One could say that current modern [REST][027] APIs are, in fact, JSON APIs.

REST is supposed to be built on top of hypertext, so [the claim holds][028].

## So we need a server just for htmx. Right?

Not quite.

We do need at least one server, but it doesn't need to be specific to htmx.

[For example][029], we can write a [kotlin][030] web application using a
[decent web framework][031] and it does not need to know nothing specific to
htmx. All it needs to know is [how to respond requests with html][032].

In the example bellow we wire the routes for a simple todo app:

```kotlin
package sample.htmx

import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.*
import io.javalin.rendering.template.JavalinVelocity
import org.slf4j.LoggerFactory
import sample.htmx.config.Database
import sample.htmx.controller.TodoController

class App(
    val controller: TodoController = TodoController(),
    val javalin: Javalin = Javalin.create { config ->
        config.fileRenderer(JavalinVelocity())
        config.staticFiles.enableWebjars()
        config.router.apiBuilder {
            get("/", controller::index)
            path("/todos") {
                get(controller::list)
                post(controller::insert)
                path("/{id}") {
                    get(controller::find)
                    put(controller::update)
                    delete(controller::delete)
                }
            }
        }
    }
) {

    private val logger by lazy { LoggerFactory.getLogger(App::class.java) }

    fun start(port: Int = 8080) {
        logger.info("start app on port $port")
        javalin.start(port)
    }
}

fun main() {
    Database.init()
    val app = App()
    app.start()
}
```

The `JavalinVelocity` renderer knows how to render pages of fragment pages using
a very [old, reliable, classic template engine][033] while `TodoController`
does what a classic [controller from MVC design pattern][034] is supposed to do:

```kotlin
package sample.htmx.controller

import io.javalin.http.Context
import org.slf4j.LoggerFactory
import sample.htmx.model.TodoItem
import sample.htmx.service.TodoService

class TodoController(val service: TodoService = TodoService()) {

    private val logger by lazy { LoggerFactory.getLogger(TodoController::class.java) }

    fun index(ctx: Context): Context {
        logger.info("index")
        val todos = service.list()
        return ctx.render("/templates/velocity/index.vm", mapOf("todos" to todos))
    }

    fun list(ctx: Context): Context {
        logger.info("list")
        val todos = service.list(ctx.queryParam("q"))
        return ctx.render("/templates/velocity/todos/list.vm", mapOf("todos" to todos))
    }

    fun find(ctx: Context): Context {
        logger.info("find")
        val id = ctx.pathParam("id").toLong()
        val todo = service.find(id)
        return ctx.render("/templates/velocity/todos/detail.vm", mapOf("todo" to todo))
    }

    fun insert(ctx: Context): Context {
        logger.info("insert")
        val todo = TodoItem(description = ctx.formParam("description").toString())
        service.insert(todo)
        val todos = service.list()
        return ctx.render("/templates/velocity/todos/list.vm", mapOf("todos" to todos))
    }

    fun update(ctx: Context): Context {
        logger.info("update")
        val todo = TodoItem(
            description = ctx.formParam("description").toString(),
            done = ctx.formParam("done").toBoolean()
        )
        val id = ctx.pathParam("id").toLong()
        todo.id = id
        service.update(todo)
        return ctx.render("/templates/velocity/todos/list.vm", mapOf("todos" to service.list()))
    }

    fun delete(ctx: Context): Context {
        logger.info("delete")
        val id = ctx.pathParam("id").toLong()
        service.delete(id)
        return ctx.render("/templates/velocity/todos/list.vm", mapOf("todos" to service.list()))
    }

}
```

The controller checks data from service, do some validation and then renders the
response.

One key difference here is the result: unlike traditional services around there,
the result isn't a json or xml: it's a html fragment dynamically produced by a
velocity template.

This is the `index.vm` template, to show a sample:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Sample Javalin with HTMX</title>
    <script src="/webjars/htmx.org/2.0.0-alpha1/dist/htmx.js"></script>
    <script>
        htmx.logAll();
    </script>
</head>
<body>
<h1>TODO List</h1>
    #parse("/templates/velocity/todos/form.vm")
    #parse("/templates/velocity/todos/list.vm")
</body>
</html>
```

It does basic htmx bootstrap and uses other templates to compose itself.

List template shows a button used to update item:

```html
<table id="table">
    <tr>
        <th>#</th>
        <th>Description</th>
        <th>Done?</th>
        <th></th>
    </tr>
    #foreach($todo in $todos)
        <tr>
            <td>$todo.id <input class="edit$todo.id" type="hidden" value="$todo.id"/></td>
            <td><input class="edit$todo.id" type="text" name="description" value="$todo.description"/></td>
            <td>
                <!-- TODO try to use checkboxes again -->
                <select class="edit$todo.id" name="done">
                    <option #if($todo.done) selected #end>true</option>
                    <option #if(!$todo.done) selected #end>false</option>
                </select>
            </td>
            <td>
                <button hx-put="/todos/$todo.id" hx-swap="outerHTML"
                        hx-target="#table" hx-include=".edit$todo.id">Save
                </button>
            </td>
        </tr>
    #end
</table>
```

The button performs a PUT request to server to update the item knowing its id.
the `hx-target` orients htmx to place the result of this request as a
replacement for the entire table and `hx-include` collects all field values we
want to be present in this request.

Since htmx augments html, we're not tied anymore to either use javascript
directly to perform a request or to create a form and make either GET or POST
request. Besides that, rules remains the same, we send the name/value pair of
the element in the request.

### A few bits about the server

Nothing really special on this server regarding htmx. Due it's declarative
nature, any template language will cope well with render it properly.

Our server uses [Jdbi][035] to query a [h2][036] database and uses two testing
frameworks, [JUnit][037] and [Spock][038].

The [Database configuration][039] shows how simple is to interact with the
database using Jdbi:

```kotlin
package sample.htmx.config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.github.cdimascio.dotenv.Dotenv
import org.jdbi.v3.core.Jdbi
import javax.sql.DataSource

class Database {

    companion object {

        private val dotenv by lazy {
            Dotenv.configure().load()
        }

        private val config by lazy {
            HikariConfig(dotenv.get("DATASOURCE_PROPERTIES"))
        }

        private val dataSource: DataSource by lazy {
            HikariDataSource(config)
        }

        val jdbi: Jdbi by lazy {
            Jdbi.create(dataSource)
        }

        @JvmStatic
        fun init() {
            jdbi.withHandle<Any, Exception> { handle ->
                handle.execute("""
                    create table if not exists todos(
                        id integer primary key auto_increment,
                        description text not null,
                        done boolean default false,
                        created timestamp default now()
                    );
                """.trimIndent())
            }
        }

        @JvmStatic
        fun testSeed() {
            jdbi.withHandle<Any, Exception> { handle ->
                handle.execute("""
                    insert into todos (done, description) values (true,'laundry');
                    insert into todos (done, description) values (false,'lunch');
                    insert into todos (done, description) values (false,'exercise');
                """.trimIndent())
            }
        }
    }
}
```

The SQL queries are executed inside lambdas.

[Javalin has a very handy test helper][040] which allow us to test requests in a
very clear way:

```kotlin
package sample.htmx

import io.javalin.testtools.JavalinTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import sample.htmx.config.Database
import sample.htmx.model.TodoItem

class ApiTest {

    private val app = App()
    private lateinit var todos: List<TodoItem>

    @BeforeEach
    fun setup() {
        Database.init()
        Database.testSeed()
        todos = app.controller.service.list()
    }

    @Test
    fun `Should check TodoItem endpoints`() = JavalinTest.test(app.javalin) { server, client ->
        // basic GET endpoints
        Assertions.assertEquals(200, client.get("/").code)
        Assertions.assertEquals(200, client.get("/todos").code)
        Assertions.assertEquals(200, client.get("/todos/${todos.first().id}").code)
        // new/modify TodoItem
        Assertions.assertEquals(200, client.post("/todos", "description=new todo").code)
        Assertions.assertEquals(200, client.put("/todos/${todos.first().id}", "description=update todo").code)
        // remove
        Assertions.assertEquals(200, client.delete("/todos/${todos.first().id}").code)
    }
}
```

Spock framework has a [neat assertion style and other goodies][041] that will be
explored in future writings:

```groovy
package sample.htmx

import java.time.LocalDateTime

import sample.htmx.config.Database
import sample.htmx.model.TodoItem
import sample.htmx.service.TodoService
import spock.lang.Shared
import spock.lang.Specification

class ServiceTest extends Specification {

    @Shared
    def service = new TodoService()

    def setup() {
        Database.init()
    }

    def "Should list todos"() {
        expect:
        service.list("") != null
    }

    def "should insert todo"() {
        given:
        def result = service.insert(new TodoItem())
        when:
        def check = service.list("")
        then:
        check != null
        check.size() > 0
    }

    def "should update todo"() {
        given:
        def id = service.insert(new TodoItem())
        when:
        def result = service.update(new TodoItem(id, "updated", true, LocalDateTime.now()))
        def check = service.list("updated")
        then:
        check != null
        check.size() > 0

    }

    def "should delete todo"() {
        given:
        def id = service.insert(new TodoItem())
        when:
        def result = service.delete(id)
        def check = service.find(id)
        then:
        thrown(Exception)
    }

}
```

Finally, it uses [JaCoCo][042] to produce coverage reports [during CI][043].

## What makes htmx to be more than just a hype(rtext)?

Whenever facing a problem hard to solve, identify a simpler problem with same
results and solve it.

That way you solved the hard problem too.

Current frontend scenario does partial updates and try as much as possible
mimetize lost things that always have been present in vanilla web technologies.
With htmx those partial updates are simple and natural thanks to html
augmentation and lost things are back because the extra layers from current
frontend solutions simple are not needed and aren't there.

It is a game-changer.

Also, i chose the more arbitrary possible stack to integrate with htmx and ran
into no issue that couldn't be solved by simply reading the docs. That helps to
endorse a safe adoption of any technology.

## Conclusion

This article is a bit opinionated but the presented tech works and works well.
[Talk is cheap, show me the code][044], one could say.

If you have a chance, try htmx.

Happy hacking!

[000]: https://react.dev/
[001]: https://angular.io/start
[002]: https://nextjs.org/
[003]: https://webpack.js.org/
[004]: https://htmx.org/docs/#introduction
[005]: https://en.wikipedia.org/wiki/HTML
[006]: https://en.wikipedia.org/wiki/HTTP
[007]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
[008]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
[009]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
[010]: https://www.php.net/
[011]: https://jquery.com/
[012]: https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data
[013]: https://en.wikipedia.org/wiki/AngularJS
[014]: https://browserify.org/
[015]: https://webpack.js.org/
[016]: https://developer.mozilla.org/en-US/docs/Glossary/SPA
[017]: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel
[018]: https://vuejs.org/
[019]: https://jamstack.org/
[020]: https://developer.mozilla.org/en-US/docs/Glossary/SEO
[021]: https://vuejs.org/guide/scaling-up/ssr.html
[022]: https://vercel.com/blog/understanding-react-server-components
[023]: https://www.11ty.dev/docs/plugins/partial-hydration/
[024]: https://vitejs.dev/
[025]: https://nuxt.com/
[026]: https://json.org
[027]: https://developer.mozilla.org/en-US/docs/Glossary/REST
[028]: https://github.com/bigskysoftware/htmx/discussions/2325#discussioncomment-8492413
[029]: https://github.com/sombriks/sample-htmx-javalin
[030]: https://kotlinlang.org/
[031]: https://javalin.io/
[032]: https://javalin.io/plugins/rendering
[033]: https://velocity.apache.org/engine/1.7/user-guide.html#hello-velocity-world
[034]: https://developer.mozilla.org/en-US/docs/Glossary/MVC
[035]: https://jdbi.org/
[036]: https://www.h2database.com/html/main.html
[037]: https://junit.org/junit5/
[038]: https://spockframework.org/
[039]: https://github.com/sombriks/sample-htmx-javalin/blob/main/src/main/kotlin/sample/htmx/config/Database.kt
[040]: https://javalin.io/tutorials/testing
[041]: https://spockframework.org/spock/docs/2.3/spock_primer.html
[042]: https://www.jacoco.org/jacoco/trunk/index.html
[043]: https://github.com/sombriks/sample-htmx-javalin/actions
[044]: https://www.goodreads.com/quotes/437173-talk-is-cheap-show-me-the-code

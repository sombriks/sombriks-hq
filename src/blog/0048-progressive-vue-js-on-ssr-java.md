---
layout: blog-layout.pug
tags:
  - posts
  - vue
  - petite-vue
  - java
  - sql
  - spring
  - webjars
  - liquibase
  - thymeleaf
  - progressive
  - database migrations
date: 2023-03-28
---
# Progressive Vue on spring-boot

Modern front-end drifted away from classical dynamic pages a lot, yet it's not
done evolving yet.

If we all were talking about
[SPA](https://en.wikipedia.org/wiki/Single-page_application)'s and
[PWA](https://en.wikipedia.org/wiki/Progressive_web_app)'s ove the years, the
new gossip in the bar are
[SSR](https://vuejs.org/guide/scaling-up/ssr.html)'s and
[SSG](https://www.11ty.dev/docs/getting-started/)'s.

Funny part is how similar to [traditional](https://www.php.net/)
[dynamic](https://www.oracle.com/java/technologies/jspt.html)
[sites](https://dotnet.microsoft.com/en-us/apps/aspnet) those techniques are.

In this article we're diving into how leverage some features from modern web
development into a traditional dynamic java web application.

## The java web app

One sample app to manage a todo-list using server side rendering with
spring-boot can be generated using
[spring initializr](https://start.spring.io/):

Select java version up to 11, spring boot 2.7 or higher depending on installed
java version on your machine.

![initializr-1.png](/post-pics/0048-progressive-vue-js-on-ssr-java/initializr-1.png)

On dependencies, select:

- Spring Web
- Thymeleaf
- Spring Data JPA
- H2 Database
- Liquibase Migration
- Lombok

![initializr-2.png](/post-pics/0048-progressive-vue-js-on-ssr-java/initializr-2.png)

In our example, the application handles the entire todo list just using forms:

![initializr-2.png](/post-pics/0048-progressive-vue-js-on-ssr-java/todo-app-1.png)

There is zero-javascript yet the app is dynamic:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
  <title>TODO list</title>
  <meta charset="utf-8">
  <link rel="stylesheet" href="app.css"/>
</head>
<body>
<main>
  <article>
    <h1>My todo list</h1>
    <table>
      <thead>
      <tr>
        <th>Description</th>
        <th></th>
      </tr>
      <tr>
        <th colspan="2">
          <form th:action="@{/save}" method="post">
            <input name="descricao" type="text"/>
            <input type="submit" value="new"/>
          </form>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr th:each="t : ${todos}">
        <td th:text="${t.descricao}"></td>
        <td>
          <form th:action="@{/}" method="post">
            <input type="hidden" name="id" th:value="${t.id}"/>
            <input type="submit" value="done"/>
          </form>
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="2">There are <span th:text="${todos.size()}"></span> tasks</td>
      </tr>
      </tfoot>
    </table>
  </article>
</main>
</body>
</html>
```

However, we got several document reloads and this is why things like SPA's where
born in the first place.

On the other hand, SPA's usually loads an empty page with a
[mount point](https://vuejs.org/api/application.html#app-mount), a
_not so small_ js bundle and only then the application kicks in.

How to find the balance then?

## Enter petite-vue

In order to avoid both empty page and unnecessary full reloads, we will apply
techniques focused on partial loads, nowadays called
[hydration](https://v2.ssr.vuejs.org/guide/hydration.html) if it's an SSR
solution or [islands](https://cloudcannon.com/blog/ssg-history-8-islands/) on
SSG ones.

Let's start by adding [petite-vue](https://github.com/vuejs/petite-vue#usage) as
a [webjar](https://www.webjars.org/) dependency:

```groovy
// build.gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.liquibase:liquibase-core'
    implementation 'org.webjars.npm:petite-vue:0.4.1' // new pedendency


    compileOnly 'org.projectlombok:lombok'
    compileOnly 'org.springframework.boot:spring-boot-devtools'

    runtimeOnly 'com.h2database:h2'

    annotationProcessor 'org.projectlombok:lombok'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
// build.gradle
```

Then add the script dependency for this on html thymeleaf template:

```html
<!-- index.html -->
<head>
  <title>TODO list</title>
  <meta charset="utf-8">
  <link rel="stylesheet" href="app.css"/>
  <script type="text/javascript" src="webjars/petite-vue/0.4.1/dist/petite-vue.umd.js"></script>
 
</head>
<!-- index.html -->
```

Add a petite-vue application on your document. It will look like this:

```html
<script th:inline="javascript">
  document.addEventListener("DOMContentLoaded", () => {

    const baseOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };

    PetiteVue.createApp({
      todos: [[${todos}]],
      descricao: "",
      async newTodo() {
        await fetch("/save", {
          ...baseOptions,
          body: `descricao=${this.descricao}`,
        });
        this.descricao = "";
        await this.listTodos();
      },
      async removeTodo(id) {
        await fetch("/", {
          ...baseOptions,
          body: `id=${id}`
        })
        await this.listTodos();
      },
      async listTodos() {
        const result = await fetch("/list", {
          ...baseOptions, method: "GET"
        })
        this.todos = await result.json();
      }
    }).mount();
  });
</script>
```

You will need to chane your html too.

Since there is already content rendered from server, you hydration strategy must
involve the content swap as well.

On that matter, (petite-)vue js shines, because once reactive script kicks in,
with a few smart checks it's possible to seamlessly replace content. This is
the part where progressive reactivity happens:

{% raw %}

```html
<h1>My todo list</h1>
<table v-scope><!-- the v-scope directive instructs where petite-vue enters -->
  <thead>
  <tr>
    <th>Description</th>
    <th></th>
  </tr>
  <tr>
    <th colspan="2">
      <input name="descricao" type="text" v-model="descricao"/>
      <button @click="newTodo()">new</button>
    </th>
  </tr>
  </thead>
  <tbody>
  <!-- from server -->
  <tr v-if="!todos" th:each="t : ${todos}">
    <td th:text="${t.descricao}"></td>
    <td>
      <input type="hidden" name="id" th:value="${t.id}"/>
      <!--          <button th:@click="removeTodo(${t.id})">done</button>-->
      <!-- original forms can be removed since reactive js will handle things -->
    </td>
  </tr>
  <!-- from hydration -->
  <tr v-for="t in todos" :key="t.id">
    <td>{{t.descricao}}</td>
    <td>
      <button @click="removeTodo(t.id)">done</button>
    </td>
  </tr>
  </tbody>
  <tfoot>
  <tr>
    <td v-if="!todos" colspan="2">There are <span
        th:text="${todos.size()}"></span> tasks
    </td>
    <td v-else colspan="2">There are {{todos.length}} tasks</td>
  </tr>
  </tfoot>
</table>
```

{% endraw %}

And finally, a new endpoint in the controller must be created in order to return
the todo list as JSON:

```java
// TodoController.java
@ResponseBody
@GetMapping("list")
public List<Todo> list(){
    return service.listTodos();
}
// TodoController.java
```

Because we're using the `@Controller`
[stereotype](https://stackabuse.com/controller-and-restcontroller-annotations-in-spring-boot/)
instead of `@RestController` (due the need of serve thymeleaf templates), it's
important to add the `@ResponseBody` annotation to this one.

## Conclusion

In this article we pass over some modern web development topics and mock a
little on how things look circular, with bleeding edge techniques resembling
much of the past.

Truth is, new points of view brings good bits from every single past concepts,
that's why we see things happening again. But not quite the same.

In terms of _Developer Experience&#8482;_, old programmers will be amazed by
reactivity while new ones will miss so much things like hot module replacement
and dedicated devtools browser extensions.

But here it is, it's possible to breath new life on server side applications
with little effort, as
[the source code for this article](https://github.com/sombriks/sample-progressive-app)
can prove.

Happy hacking!

## References

- <https://www.thymeleaf.org/doc/articles/springmvcaccessdata.html>
- <https://www.baeldung.com/spring-boot-testing-log-level>
- <https://github.com/vuejs/petite-vue>
- <https://docs.spring.io/spring-boot/docs/1.5.16.RELEASE/reference/html/using-boot-devtools.html>
- <https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build>
- <https://www.webjars.org/documentation#springboot>
- <https://stackoverflow.com/a/40875357/420096>
- <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>

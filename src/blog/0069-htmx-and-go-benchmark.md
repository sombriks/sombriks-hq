---
layout: blog.pug
tags:
  - posts
  - htmx
  - sql
  - orm
  - gorm
  - SOLID
  - development good practices
  - sqlite
  - golang
  - liquid
  - benchmark
  - k6
date: 2024-03-31
draft: false
---
# HTMX app using a GO stack with a little benchmark

This post present one approach on how to serve an [htmx.org][htmx] application
using the [golang][go] ecosystem.

## HTMX rocks

In [previous][0067] [articles][0068] i already covered how good htmx is and
therefore it should be present on your next project.

Modern javascript frameworks attempt to be as much declarative as possible and
build [convoluted structures][react-use-effect] to mimetize it on top of
[even more complex][react-props] abstractions.

But you know what already is declarative and use zero javascript? Good old
[Hypertext][html].

The bright in htmx approach is to use javascript to get javascript out of the
way and declare things directly in the declarative language.

But in order to use it in new projects, [HATEOAS][hateoas] must be proper
honored by your server side API and for that you need a server side stack able
to do the minimum following:

- Serve html
- Process html templates

I have here a few examples already ([java][htmx-java], [kotlin][htmx-kotlin] and
[node][htmx-node]) with [decent performance][benchmark], but wondered how good a
stack involving golang would be.

So here we are.

## The GO ecosystem (and it's challenges)

[GO or golang][go] is no news nowadays, all modern cool stuff seems to have been
built on it, like [docker][docker], [kubernetes][k8s] and a lot of other tools
lurking around.

It's a nice language because it's designed to be brutally simple, memory safe
and cross-platform in ways that other languages can just dream of.

It also has a [very rich ecosystem][go-pkg], so you don't need to write
everything you need from scratch.

But some people beg to differ.

### The 'use the platform' guideline

Golang simplicity goes into extremes.

There is no [self][self] or [this][this]. There is no special syntax for the
[constructor function][constructor].

On top of that, there is the 'use the platform' philosophy. It stimulates the
developer to avoid as much as possible to install trivial libraries that can be
implemented locally with little overhead.

It originates (_citation needed_) from a talk from [Rob Pike][rob-pike] about
the language, among many other recommendations.

Some people takes this orientation as dogma and, well, it works against a lot of
good solutions, as you can imagine.

### The '3rd party' libraries question

Given that golang developers tries to not use 3rd party solutions, many end up
[creating their own toolboxes][go-toolbox], and some of those tools end up in
public repositories. Such repos are just from a couple of steps from becoming
proper publicly available packages.

This is why the the guideline gets empty: same solution will appear again and
again, and there is a lot of history just dedicated to such situations in
software development.

## A DRY, SOLID approach

To ease the hearts using 3rd party libraries in golang solutions, remember
[DRY][dry].

Don't Repeat Yourself.

If the problem is solved and the code is available, go and get that solution, as
long as it's compatible with your problem.

### Project structure

A second key issue is [project structure][go-module]. Some say
(_citation needed_) that go projects must be as simple as possible. They also
read just the first paragraph about this and forget about 30 years of software
development best practices.

Go has package support and it's more than ok to use them, it's good practice.
It's the ["I"][i] in [SOLID][solid] (or the [High Cohesion][cohesion] in
[GRASP][grasp]) When you see [spring stereotypes][spring-stereotypes], it's not
a "java thing", it's an implementation of an industry standard.

That being said, this is the structure for [this sample project][htmx-go]:

```bash
sombriks@hornet sample-htmx-chi % tree .
.
├── README.md
├── app
│   ├── assets
│   │   └── htmx-1.9.11.min.js
│   ├── configs
│   │   ├── database.go
│   │   └── renderer.go
│   ├── controllers
│   │   ├── assets-controller.go
│   │   └── todo-controller.go
│   ├── models
│   │   └── todo.go
│   ├── server.go
│   ├── services
│   │   └── todo-service.go
│   └── templates
│       ├── index.liquid
│       └── todos
│           ├── detail.liquid
│           ├── form.liquid
│           └── list.liquid
├── go.mod
├── go.sum
└── main.go

9 directories, 18 files
```

The `main.go` is our entrypoint, `server.go` is where we do our _setup_. The
packages `configs`, `controllers`, `models` and `services` are meant to proper
concerns separation. The `templates` isn't a package but does concern separation
as well: it holds [liquid templates][liquid].

### Templates

A quick note on [GO templates][go-templates]: in order to proper mimetize the
other implementations, a proper template engine was required. The built-in
template engine lacks control flows and loops, therefore the resulting project
would be too far different.

So we chose one engine from a [curated list of template engines][awesome-go-tpl]
available for GO.

### API Framework

Again, in order to keep the sample as similar as possible, one framework capable
of [api-building][api-builder] was chosen. [chi][chi] does
[the job][go-api-builder] in a [very][node-api-builder]
[similar][kotlin-api-builder] way the others do.

### Data access

Finally, the [ORM][gorm] was added to make sure we got some overhead and syntax
sugar, just like the other versions.

## Code comparison

Now this is where this stack really shines.

The language is simple, objective, clean as javascript but has types:

```go
package controllers

import (
 "github.com/go-chi/chi/v5"
 "net/http"
 "sample-htmx-chi/app/configs"
 "sample-htmx-chi/app/models"
 "sample-htmx-chi/app/services"
)

type TodoController struct {
 config  *configs.Config
 service *services.TodoService
}

func NewTodoController(config *configs.Config, service *services.TodoService) *TodoController {
 var controller TodoController
 controller.config = config
 controller.service = service
 return &controller
}

func (controller *TodoController) IndexHandler(writer http.ResponseWriter, request *http.Request) {
 q := request.URL.Query().Get("q")
 controller.response(writer, "index.liquid", q)
}

func (controller *TodoController) ListHandler(writer http.ResponseWriter, request *http.Request) {
 q := request.URL.Query().Get("q")
 controller.response(writer, "todos/list.liquid", q)

}

func (controller *TodoController) InsertHandler(writer http.ResponseWriter, request *http.Request) {
 todo, err := models.TodoFromForm(request)
 if err != nil {
  writer.WriteHeader(422)
  writer.Write([]byte(err.Error()))
  return
 }
 controller.service.Insert(todo)
 q := request.URL.Query().Get("q")
 controller.response(writer, "todos/list.liquid", q)
}

func (controller *TodoController) FindHandler(writer http.ResponseWriter, request *http.Request) {
 id := chi.URLParam(request, "id")
 todo, err := controller.service.Find(id)
 if err != nil {
  writer.WriteHeader(500)
  writer.Write([]byte(err.Error()))
  return
 }
 data := map[string]interface{}{"todo": todo}
 controller.config.Render(writer, "todos/detail.liquid", data)
}

func (controller *TodoController) UpdateHandler(writer http.ResponseWriter, request *http.Request) {
 id := chi.URLParam(request, "id")
 todo, err := models.TodoFromForm(request)
 if err != nil {
  writer.WriteHeader(422)
  writer.Write([]byte(err.Error()))
  return
 }
 todo.SetId(id)
 controller.service.Update(todo)
 q := request.URL.Query().Get("q")
 controller.response(writer, "todos/list.liquid", q)
}

func (controller *TodoController) DeleteHandler(writer http.ResponseWriter, request *http.Request) {
 id := chi.URLParam(request, "id")
 controller.service.Delete(id)
 q := request.URL.Query().Get("q")
 controller.response(writer, "todos/list.liquid", q)
}

func (controller *TodoController) response(writer http.ResponseWriter, view string, q string) {
 list, err := controller.service.List(q)
 if err != nil {
  writer.WriteHeader(500)
  writer.Write([]byte(err.Error()))
  return
 }
 data := map[string]interface{}{"todos": list}
 controller.config.Render(writer, view, data)
}
```

This is the equivalent on node/koa:

```javascript
import { logger } from "../configs/logging.js"
/**
 * closure defining all requests
 * 
 * @param {*} service 
 * @returns 
 */
export const todoController = (service) => {

  // simply serve the template root
  const index = async ctx => ctx.render("index.njk", { todos: await service.list() })

  // serve the table again 
  const list = async ctx => {
    const { q = "" } = ctx.query
    const todos = await service.list(q)
    return ctx.render("todos/list.njk", { todos })
  }

  // insert new todo and serve table again
  const insert = async ctx => {
    const { description } = ctx.request.body
    const result = await service.insert({ description })
    logger.info(`success ${result}`)
    const todos = await service.list()
    return ctx.render("todos/list.njk", { todos })
  }

  const find = async ctx => {
    const { id } = ctx.params
    const todo = await service.find(id)
    return ctx.render("todos/detail.njk", { todo })
  }

  const update = async ctx => {
    const { id } = ctx.params
    const { description, done } = ctx.request.body
    const result = await service.update(id, { description, done })
    logger.info(`success ${result}`)
    const todos = await service.list()
    return ctx.render("todos/list.njk", { todos })
  }

  const del = async ctx => {
    const { id } = ctx.params
    const result = await service.del(id)
    logger.info(`success ${result}`)
    const todos = await service.list()
    return ctx.render("todos/list.njk", { todos })
  }

  return {
    index, list, find, insert, update, del
  }
}
```

We can see that besides a few helper functions, we go similar intelectual load
to proper read both controllers.

A similar result will be felt on the other layers (services, configs, etc).

## Benchmark results

And last but not least, some numbers!

Comparing GO and Node implementations using the [benchmark][benchmark], on the
following hardware:

```bash
  Identificador do Modelo: MacBookAir10,1
  Chip: Apple M1
  Número Total de Núcleos: 8 (4 desempenho e 4 eficiência)
  Memória: 16 GB
```

Test are made with [k6][k6] benchmark tool.

This is the result for node/koa:

```bash
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: benchmark-koa.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)


     ✓ 200 ok

     checks.........................: 100.00% ✓ 81639       ✗ 0    
     data_received..................: 64 MB   2.1 MB/s
     data_sent......................: 6.5 MB  218 kB/s
     http_req_blocked...............: avg=931ns   min=0s     med=1µs    max=1.8ms   p(90)=1µs    p(95)=1µs   
     http_req_connecting............: avg=69ns    min=0s     med=0s     max=939µs   p(90)=0s     p(95)=0s    
     http_req_duration..............: avg=3.64ms  min=2.98ms med=3.43ms max=58.27ms p(90)=4.02ms p(95)=4.62ms
       { expected_response:true }...: avg=3.64ms  min=2.98ms med=3.43ms max=58.27ms p(90)=4.02ms p(95)=4.62ms
     http_req_failed................: 0.00%   ✓ 0           ✗ 81639
     http_req_receiving.............: avg=13.05µs min=9µs    med=12µs   max=2.22ms  p(90)=15µs   p(95)=18µs  
     http_req_sending...............: avg=3.31µs  min=2µs    med=3µs    max=816µs   p(90)=4µs    p(95)=5µs   
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s     max=0s      p(90)=0s     p(95)=0s    
     http_req_waiting...............: avg=3.62ms  min=2.96ms med=3.41ms max=58.07ms p(90)=4ms    p(95)=4.59ms
     http_reqs......................: 81639   2721.019372/s
     iteration_duration.............: avg=3.67ms  min=3ms    med=3.45ms max=60.33ms p(90)=4.05ms p(95)=4.65ms
     iterations.....................: 81639   2721.019372/s
     vus............................: 10      min=10        max=10 
     vus_max........................: 10      min=10        max=10 


running (0m30.0s), 00/10 VUs, 81639 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s
```

And this is for GO/chi:

```bash

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: benchmark-koa.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)


     ✓ 200 ok

     checks.........................: 100.00% ✓ 91763       ✗ 0    
     data_received..................: 310 MB  10 MB/s
     data_sent......................: 7.3 MB  245 kB/s
     http_req_blocked...............: avg=1.66µs min=0s       med=1µs    max=917µs   p(90)=2µs    p(95)=3µs   
     http_req_connecting............: avg=44ns   min=0s       med=0s     max=474µs   p(90)=0s     p(95)=0s    
     http_req_duration..............: avg=3.2ms  min=452µs    med=2.99ms max=17.51ms p(90)=4.98ms p(95)=5.7ms 
       { expected_response:true }...: avg=3.2ms  min=452µs    med=2.99ms max=17.51ms p(90)=4.98ms p(95)=5.7ms 
     http_req_failed................: 0.00%   ✓ 0           ✗ 91763
     http_req_receiving.............: avg=27.9µs min=7µs      med=23µs   max=1.18ms  p(90)=45µs   p(95)=56µs  
     http_req_sending...............: avg=7.27µs min=2µs      med=5µs    max=1.31ms  p(90)=11µs   p(95)=15µs  
     http_req_tls_handshaking.......: avg=0s     min=0s       med=0s     max=0s      p(90)=0s     p(95)=0s    
     http_req_waiting...............: avg=3.17ms min=417µs    med=2.95ms max=17.48ms p(90)=4.94ms p(95)=5.67ms
     http_reqs......................: 91763   3058.573467/s
     iteration_duration.............: avg=3.26ms min=482.91µs med=3.04ms max=17.62ms p(90)=5.03ms p(95)=5.76ms
     iterations.....................: 91763   3058.573467/s
     vus............................: 10      min=10        max=10 
     vus_max........................: 10      min=10        max=10 


running (0m30.0s), 00/10 VUs, 91763 complete and 0 interrupted iterations
```

With no surprises, go version is faster, even if we take in consideration that
there is some I/O involved in this particular benchmark.

The noteworthy point is: go stack delivers better results using
**7 times less memory**!

While the node process goes around 70mb, go binary uses roughly 10mb.

It even beats java/spring in performance (at least in this hardware):

```bash
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: benchmark-javalin.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 10 looping VUs for 30s (gracefulStop: 30s)


     ✓ 200 ok

     checks.........................: 100.00% ✓ 86391      ✗ 0    
     data_received..................: 68 MB   2.3 MB/s
     data_sent......................: 6.9 MB  230 kB/s
     http_req_blocked...............: avg=2.42µs  min=0s       med=2µs    max=3.25ms   p(90)=3µs    p(95)=4µs    
     http_req_connecting............: avg=49ns    min=0s       med=0s     max=541µs    p(90)=0s     p(95)=0s     
     http_req_duration..............: avg=3.38ms  min=537µs    med=2.4ms  max=443.69ms p(90)=5.9ms  p(95)=10.57ms
       { expected_response:true }...: avg=3.38ms  min=537µs    med=2.4ms  max=443.69ms p(90)=5.9ms  p(95)=10.57ms
     http_req_failed................: 0.00%   ✓ 0          ✗ 86391
     http_req_receiving.............: avg=35.5µs  min=8µs      med=28µs   max=5.64ms   p(90)=59µs   p(95)=73µs   
     http_req_sending...............: avg=10.06µs min=2µs      med=7µs    max=10.81ms  p(90)=15µs   p(95)=20µs   
     http_req_tls_handshaking.......: avg=0s      min=0s       med=0s     max=0s       p(90)=0s     p(95)=0s     
     http_req_waiting...............: avg=3.33ms  min=514µs    med=2.35ms max=443.18ms p(90)=5.84ms p(95)=10.51ms
     http_reqs......................: 86391   2879.59739/s
     iteration_duration.............: avg=3.46ms  min=599.87µs med=2.47ms max=445.97ms p(90)=6.01ms p(95)=10.66ms
     iterations.....................: 86391   2879.59739/s
     vus............................: 10      min=10       max=10 
     vus_max........................: 10      min=10       max=10 


running (0m30.0s), 00/10 VUs, 86391 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s
```

And when it comes to memory, **java virtual machine consumes about 200mb**,
making it require **20 times more memory than go binary**!

That's something i would say!

## Further steps

While benchmark is fun and all, It's quite pleasant see how trivial is to serve
an htmx application using the big and trustful stacks available today. From here
the following changes might happen to the sample golang project:

- Add a few unit and integration tests.
- See how it behaves under bigger loads; our current benchmark is too gentle!
- Create more complex, rich applications

Hope you have enjoyed the reading and i hope it comes to be useful in your
decision-making regarding the tech-stack to use to deliver a solution.

Happy hacking!

[htmx]: https://htmx.org
[go]: https://go.dev/
[0067]: /blog/0067-you-should-try-htmx
[0068]: /blog/0068-benchmark-with-k6
[react-use-effect]: https://overreacted.io/a-complete-guide-to-useeffect/
[react-props]: https://react.dev/learn/sharing-state-between-components
[html]: https://developer.mozilla.org/en-US/docs/Web/HTML
[hateoas]: https://htmx.org/essays/hateoas/
[htmx-java]: https://github.com/sombriks/sample-htmx-spring
[htmx-kotlin]: https://github.com/sombriks/sample-htmx-javalin
[htmx-node]: https://github.com/sombriks/sample-htmx-koa
[benchmark]: https://github.com/sombriks/node-vs-kotlin-k6-benchmark
[docker]: https://www.docker.com/
[k8s]: https://kubernetes.io/
[go-pkg]: https://pkg.go.dev/
[self]: https://docs.python.org/3/tutorial/classes.html#class-objects
[this]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
[constructor]: https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html
[rob-pike]: https://en.wikipedia.org/wiki/Rob_Pike
[go-toolbox]: https://github.com/search?q=golang+toolbox&type=repositories
[dry]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[go-module]: https://go.dev/doc/modules/layout
[solid]: https://en.wikipedia.org/wiki/SOLID
[i]: https://en.wikipedia.org/wiki/Interface_segregation_principle
[cohesion]: https://en.wikipedia.org/wiki/Cohesion_(computer_science)#High_cohesion
[grasp]: <https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)>
[spring-stereotypes]: https://www.geeksforgeeks.org/spring-stereotype-annotations/
[htmx-go]: https://github.com/sombriks/sample-htmx-chi
[liquid]: https://shopify.github.io/liquid/
[go-templates]: https://pkg.go.dev/text/template
[awesome-go-tpl]: https://awesome-go.com/template-engines/
[api-builder]: https://awesome-go.com/routers/
[chi]: https://go-chi.io/#/
[go-api-builder]: https://github.com/sombriks/sample-htmx-chi/blob/e3ad7ac8758978f4c4e649d5bff71bf2f656d221/app/server.go#L39
[node-api-builder]: https://github.com/sombriks/sample-htmx-koa/blob/8ec9d859ca55f7045b2c8ebeaff4d7cc8d5059ab/app/main.js#L22
[kotlin-api-builder]: https://github.com/sombriks/sample-htmx-javalin/blob/b73868a5a1d7621ad6335bfdb50e4bb7088015bf/src/main/kotlin/sample/htmx/App.kt#L15
[gorm]: https://gorm.io/
[k6]: https://k6.io/

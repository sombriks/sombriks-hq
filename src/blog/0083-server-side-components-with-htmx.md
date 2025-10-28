---
layout: blog.pug
tags:
  - posts
  - htmx
  - ssr
  - pug
  - components
  - java
  - spring-boot
  - bulma
date: 2025-06-11
draft: false
---
# Server Side Components With HTMX

_do i look like someone who knows what hydration is??_

Let's talk a little about components, controls and modern web with [htmx][htmx].

## Why Components

The last 10 years of web development revealed that component authoring allied to
good coding practices leads to code reuse and easier maintenance. A page
properly built using components has a much lesser cognitive load compared with a
similar page built without them.

On the other hand, frontend development still faces growth pains and overly
complex tooling and patterns to deliver pages and applications that where
supposed to be simple and easy to maintain.

In such scenario, htmx and other technologies proposes a kind of return to
simplicity, not meant to move back to past paradigms, but to the proper
application of well-consolidated patterns and practices.

See, what meta-frameworks like Nest.js proposes with server-rendered components
and [hydration][hydration] is quite convoluted. There are simpler ways to
achieve the same result, using less resources and less cognitive load.

The rationale is: do not give up on all modern technologies and practices
produced for over a decade in web development. Just use them wisely, with the
best tools available.

## Pages, Layouts, Components and Controls

Take the modern, well-known project structure for frontends adopted nowadays.

Pages, controls and elements are defined in the very
[HTML specification][html-spec], while components aggregate elements and
controls for better reuse.

Controls are components meant to manage on e single, simple value.

Layouts are meant to be used authoring pages, keeping common sections apart for
easier reuse.

Inadequate use of those patterns or failure in apply them results in big,
complex hard to evolve pages, usually filled with duplicated code.

This is why code reuse **must start at control level**. For example:

```pug
mixin input-text(label, name, value)
.field
  .control
    label.label(for=name)= label
    input.input(type="text", id=name,  name=name,
      value=value)&attributes(attributes)
    if attributes.help
      p.help= attributes.help
```

The [pug][pug] component above is meant to reuse when creating text inputs in
forms. It uses some [bulma][bulma] css classes.

More complex components can be easier authored using such controls as building
blocks. Complex pages can be built easier using components as building blocks.

## Server Side Workflow and Templates

Another example of control follows:

```pug
//- first call on component
if departments == null
  mixin select-department(name, value=0)
    .field
      .control
        label.label(for=name) Department
        .select.is-fullwidth
          select(id=name, name=name
            hx-get="/departments/options?selected="+(value ?? 0)
            hx-trigger="load" hx-target="closest select")
else
  option(value=0) --Choose--
  each dep in departments
    if dep.id == selected
      option(value=dep.id selected)= dep.name
    else
      option(value=dep.id)= dep.name
```

This one still handles one single value, but uses server side values and
therefore handles two distinct states: the first one, when the component is
called inside a page or component, handles the mixin declaration.

The mixin then has a request to be called once it loads in the page, in order to
recover the select options. If there is a default value, make it selected.

All this behavior is _declared_ thanks to the template language combined with
the htmx attributes.

A server-side controller able to render such option follows, implemented in
[java][java] with [spring-boot][spring-boot]:

```java
// ...

@Controller
@RequestMapping("/departments")
public class DepartmentsEP {

  private final Departments repository;

  public DepartmentsEP(Departments repository) {
    this.repository = repository;
  }

  @GetMapping("options")
  public ModelAndView options(
    @RequestParam(required = false, defaultValue = "0") Long selected
  ) {
    List<Department> departments = repository.findAll();
    Map<String, Object> model = Map.of(
        "selected", selected,
        "departments", departments);
    return new ModelAndView("controls/select-department", model);
  }
}
```

It is not mandatory to reuse the same template file to implement all control
states, however doing so, the code cohesion grows. For components, this approach
helps to manage the growing complexity and to figure out smaller components to
be extracted out from the bigger one.

And for the server code, all it knows is how to serve the proper data to the
proper server-side template, drying out the frontend code from most of possible
complexities. And this can be cached, filtered and distributed along a cluster
the same way any regular modern backend service can. Even [e2e tests][e2e]
become a particular case of server-side integration tests.

Again, this approach diminishes the cognitive load needed to deliver modern web
experiences without any functionality loss.

## Conclusion

HTMX, although very discrete, plays a key role in making modern web possible
without the actual hassles involving modern web frameworks.

Particularly, if there is two ways to deliver the same solution, i tend to
prefer the simpler one, given the results are the same.

You can see more sample code on this topic [here][repo].

Happy hacking!

[htmx]: https://htmx.org
[hydration]: https://blog.saeloun.com/2021/12/16/hydration
[html-spec]: https://html.spec.whatwg.org/#toc-semantics
[pug]: https://pugjs.org/api/getting-started.html
[bulma]: https://bulma.io
[java]: https://dev.java
[spring-boot]: https://spring.io/projects/spring-boot
[e2e]: https://circleci.com/blog/what-is-end-to-end-testing
[repo]: https://github.com/sombriks/sample-assets-estate

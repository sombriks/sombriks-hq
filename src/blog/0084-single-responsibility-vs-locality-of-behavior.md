---
layout: blog-layout.pug
tags:
  - posts
  - solid
  - lob
  - design patterns
  - spring-boot
  - pug
  - grasp
date: 2025-11-08
draft: false
---
# The 'S' in SOLID versus LOB from.. What is LOB?

The [Locality Of Behavior][lob] was first proposed by **Richard P. Gabriel**
and, for a rushed careless eye, might seem quite the opposite of what
**Uncle Bob** stated in [SOLID][solid].

## Single responsibility and separation of concerns

Key idea of single responsibility, the 'S' in the cool acronym people like to
repeat, is that a certain piece of code must have a clear job, a clear purpose.

And it must do it well.

The idea is great and makes the developer life easier because it helps to locate
easily which piece of code does what.

It has foundations on another design pattern, [separation of concerns][soc],
proposed by Edsger W. Dijkstra, a real legend from computer science history.

The [MVC][mvc] architectural pattern is also an example of this thinking.

A standard [spring boot][spring-boot] application, presenting rest controllers,
services and repositories is a good example of single responsibility principle
in practice, each part has its specific concerns to carry on before pass the
message for the next layer.

## Locality of behavior and separation of concerns

The idea behind LoB is:

```
The primary feature for easy maintenance is locality: Locality is that
characteristic of source code that enables a programmer to understand that
source by looking at only a small portion of it.
```

So, what does it mean?

Let's say we're developing a todo list. Due to the simplicity of such
application, a single source is responsible for drawing the screen, handle all
events and save it into some form of persistent technology: a file, database or
service.

This is local behavior.

Instead of a template calling event handlers from a controller module which in
turn deals with a persistence module, all is contained, tightly packed, even
coupled, into a single **location**.

Sounds quite like the anti-mvc, right?

But let's look further.

A better example is this blog itself. The [posts index  page][posts] is written
in [pug][pug], rendered into html by [eleventy][eleventy]:

```pug
---
layout: main.pug
---
-
  // all posts except drafts
  const posts = collections.posts.reverse()
  // all tags
  const tags = Object.keys(collections)
    .filter(t => collections[t].length > 1
      && t !== 'draft' 
      && t !== 'posts' 
      && t !== 'all')
    .map(t => ({[t]:collections[t].length}))
    .toSorted((a, b) => Object.values(b)[0] - Object.values(a)[0])
  // all dates, grouped
  const dates = collections.posts
    .filter(p => p.date instanceof Date)
    .map(p => p.date.getFullYear())
    .toSorted((a, b) => b - a)
    .reduce((acc, date) => {
      acc[date] = acc[date] ? acc[date] + 1 : 1
      return acc
    }, {})
h1 Blog Posts
style.
  .tag, .date {
    display: inline-block;
    margin-top:0;
  }
details
  summary Tags
  each tag in tags
    span.tag
      a(href=`${page.url}?search=${Object.keys(tag)[0]}`) 
        i= Object.keys(tag)[0] + "(" + Object.values(tag)[0] + ")"
      i &nbsp;
details
  summary Dates
  each date in Object.keys(dates)
    span.date
      a(href=`${page.url}?search=${date}`)
        i= `${date}(${dates[date]})`
      i &nbsp;
input#search(name="search" placeholder="Search blog posts..." onkeyup="filterPosts()")
div
  each post in posts
    span.post(data-tags=post.date.getFullYear()+","+post.data.tags.join(',')+","+post.fileSlug)
      //- a= Object.keys(post)
      a(href=post.url)= post.fileSlug
      i &nbsp;
      i &nbsp;
script(type="application/javascript").
  const search = document.getElementById('search')
  const filterPosts = () => {
    const posts = document.querySelectorAll('span.post')
    posts.forEach(post => {
      const tags = post.getAttribute('data-tags')
      if (tags.toLowerCase().includes(search.value.toLowerCase())) {
        post.style.display = 'inline'
      } else {
        post.style.display = 'none'
      }
    })
  }
  const query = new URLSearchParams(window.location.search)
  if (query.has('search')) {
    search.value = query.get('search')
    filterPosts()
  }
```

In this single snippet:

- [front matter data][front-matter], at the template start.
- backend javascript fragments, to condense posts listing, popular tags and
  articles per year.
- css blocks.
- markup blocks.
- frontend javascript blocks, to allow dynamic filtering of posts.

**Five** distinct **'responsibilities'**, all in a single file.

So, what is it? is locality of behavior an anti-patter then?

In short: clearly not.

You see, There are other sections, like [Links][links], and [Bio][bio]. And they
also are self-contained.

*Responsibilities* are coupled, but *concerns* are quite apart.

## It's about oranges and apples, components and layers

So, **both** *SRP* and *LoB* honors *SOC*. So, how come they look like so
opposite to each other?

Answer is simple: granularity. The *quantum* being used to measure the parts.
In the grand scheme of things, makes complete sense to look at the system as a
whole and easily identify well-defined layers, with clear responsibilities. But
it also makes sense to zoom in and identify *components* that connect to other
layers and just play a small part on the bigger scenario.

Too small components lead to pieces of code that demands the reading of several
modules to make sense of a certain feature.

Too big components end up spanning through several layers and likely become
critical points for other components, making things complex to understand.

Saying in a even simpler way, *srp* is for *layers*, *lob* is for *components*.

This is why old jQuery applications became hard to maintain, with splittered
components in half because 'markup and script has different concerns'.

This is also why Angular components usually came in folders with at least three
files: markup, style and script. React and Vue components don't do this in order
to favor concern cohesion even further.

## How to know when gather behavior into components or design distinct layers?

Actually it's quite easy.

First, model your application features into components. Then you move something
from it into another layer whenever the single component looks too complex due
some non-functional reason.

In a dynamic web application, you will need at least two layers because the code
concerning proper database connection management will bloat the component too
much, to the point of render almost impossible to figure out what is needed to
just present data and what is needed for no other reason than gather that
information without compromise system resources.

## Both approaches are needed, concerns just need to be processed in top-down

In the end, it boils up to the same *pensata*: Code must be simple to change.

Layers group concerns with similar technical challenges.

Components group concerns coupled by the same feature.

Both are strategies to keep the code with*high cohesion* (as seen in the nine
[GRASP][grasp] principles, from *Craig Larman*).

I hope it helps next time you need to design that super duper app.

Happy hacking!

[lob]: https://htmx.org/essays/locality-of-behaviour/
[solid]: https://codefinity.com/es/blog/The-SOLID-Principles-in-Software-Development?utm_source=google&utm_medium=cpc&utm_campaign=21413601262&utm_content=&utm_term=&dki=&gad_source=1&gad_campaignid=21409590893&gbraid=0AAAAABTeUgRs_3Nj-Mk_fprlsQ8WPeSPs&gclid=CjwKCAiA8bvIBhBJEiwAu5ayrL-Y1aQiu96aEPYYImMdP_Z71-UnqJBQIhw5df4Pc30FcZ8SPVoA7RoCrW0QAvD_BwE
[soc]: https://en.wikipedia.org/wiki/Separation_of_concerns
[mvc]: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
[spring-boot]: https://spring.io/guides/gs/spring-boot
[pug]: https://devdocs.io/pug/
[posts]: /blog/
[eleventy]: https://www.11ty.dev/
[front-matter]: https://www.11ty.dev/docs/data-frontmatter/
[links]: /links/
[bio]: /bio/
[grasp]: https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)

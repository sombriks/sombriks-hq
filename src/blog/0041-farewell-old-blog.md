---
layout: blog-base.webc
date: 2023-02-14
tags:
  - posts
  - misc
---

## Farewel to this blog

I am once again changing the blog.

This version was cool, a very minimalistic
[SPA](https://en.wikipedia.org/wiki/Single-page_application) and a good sample
on how cool [vuejs](https://vuejs.org/) is.

![golang-coverage](/assets/post-pics/0041-farewell-old-blog/last-screenshot.png)

## It ain't broken, why change then?

Actually it **is** broken.

I tried to put [google adsense](https://www.google.com/adsense) on it and got 5
to 6 refusals.

since it's an SPA, the crawler is unable to index it and, therefore, there is no
_valuable_ content on it. At least this is what i suspect
[after dig into adsense documentation](https://support.google.com/adsense/answer/81904?hl=pt-BR&visit_id=638119984989682795-2409927824&rd=1#insufficient_content).

## The new headquarters

This blog had so far 4 incarnations:

- <https://sombriks.wordpress.com/>
- <https://sombriks.blogspot.com/>
- <https://sombriks.com.br>
  - Here we did [V3](https://sombriks.com.br/#/blog/0019-the-new-blog.md) and
    [v4](https://sombriks.com.br/#/blog/0041-farewell-old-blog.md) 

The V5 will reside into a new url: <https://sombriks.com>

At least this is the plan.

## The tech stack

Unlike this one, V5 will be a regular static site, 100% indexable by anyone who
desires to do it.

It will be built with a static site generator tool called
[eleventy](https://www.11ty.dev/), which is pretty cool because i can use any
tempate language i want.

![eleventy supported template languages](/assets/post-pics/0041-farewell-old-blog/eleventy-template-languages.jpg)

I also has special static data rendering, so i can use front matter metadata and
json resource files directly during the render phase of the static content.

## The return to innoncence 

Over the years frontend development piled the bad name of too complex and full
of unnecessary indirections.

Those static site generators, besides the 'static' in the name, aren't static at
all. They are dynamic, modern and very capable source of dynamic content.

I am pretty sure that the age of SPA is ending.
Not that [SPA](https://goodspaguide.co.uk/features/spa-through-the-ages), this
[SPA](https://en.wikipedia.org/wiki/Single-page_application).

New developments in this direction are already leading tho new and exciting
technology hat aren't just nie to use, but also gets the job done early so we
all can go home early.

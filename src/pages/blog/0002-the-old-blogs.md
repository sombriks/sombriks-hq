---
layout: base.webc
tags:
  - posts
  - misc
  - hello
date: 2017-12-05
---
# About my old blogs

There are a few older blogs over the net.

Some of them are no-more, deleted, a few others are still online for historical purposes.

The oldest one is [this wordpress](https://sombriks.wordpress.com/). A time of wonders, the world was new.

Then we made [this blogspot](https://sombriks.blogspot.com.br/). There where little time, so the posts became scarce.

I did also a effort on other fields, like [advising the young tech professionals](https://guiadoprofissionaldasgalaxias.blogspot.com.br/). Also didn't last much longer.

The very single problem about blogging is time. It takes time.

This one have a few advantages, since it's plain markdown and commit is publish.

I can switch workspace and write things, i can then change folder again on [visual studio code](https://code.visualstudio.com/) and bam! back to work.

Sounds complicated, but is dead simple.

Hope this way i start to post more often.

Also i like markdown much more than those sneaky rich text editors.

---
Tags:
{%- for tag in tags -%}
[{{tag}}](/blog/?tag={{tag | slugify}})
{%- endfor -%}

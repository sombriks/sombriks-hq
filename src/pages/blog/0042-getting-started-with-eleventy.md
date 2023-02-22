---
layout: base.webc
date: 2023-02-19
tags: ['posts', 'eleventy', 'static site generator']
---
# Getting started with eleventy

It calls itself a [simpler static site generator](https://www.11ty.dev/).

But don't get fooled, the content generator is dynamic and versatile as hell.

## Whait is it good for

You can write your static site in plain old html, that's true.

**OR**

You can use custom template engines to create a richer experience for those who
consume your content.

The classic case is the [markdown docs](https://jamstack.org/generators/?template=markdown);
Markdown is good to write docs, but need to be processed in order to be proper
served over the internet.

There are many tools to accomplish that, but with eleventy the simplicity tops
another level.

For example:

`index.md`

```markdown
# this is my documentation

really really nice docs
```

On your console, in same folder:

```bash
npx @11ty/eleventy
```

It will produce a `_site/index.html` for you in no time:

```html
<h1>this is my documentation</h1>
<p>really really nice docs</p>
```

## There's more

Things start to get interesting when you look at other eleventy features.

For instance, it's possible to combine any template language on the same project
if you want/have to:

```bash
# install it as development dependency
npm init -y
npm install @11ty/eleventy --save-dev
echo "[go to other page](/page2)" > index.md
echo "<a href='/'>back to index</a>" > page2.njk
# serve it in development mode. make a npm script if you want
npx eleventy --serve
```

One fun fact is the rendered output will try to **hide file extensions** as much
as possible, so you don't get prisoner of html.

## There is metadata

In eleventy you can provide some useful metadata for your documents so your
content can be augmented.

You can provide a [front matter section](https://www.11ty.dev/docs/data-frontmatter/)
in your template and consume data from it with ease:

```markdown
---
title: my awesome title
foo: bar!
---
# This is {% raw %} {{title}}

I say {{foo}} {% endraw %} 
```

Will output

```html
<h1>This is my awesome title</h1>
<p>I say bar!</p>
```

## There is also custom data

It is possible to provide an external source of data to present in templates.

Just [follow the naming rules](https://www.11ty.dev/docs/data-template-dir/)
and the data is all yours to manipulate. Example:

`my-colors.md`

```markdown
# Those are the colors i like most
{% raw %} 
{% for  color in my-colors %}
- {{color}}
{% endfor %}
{% endraw %} 
```

`my-colors.json`

```json
{
  "colors": [
    "red",
    "green",
    "blue"
  ]
}
```

The output for that one is:

`_site/my-colors/index.html`

```html
<h1>Those are the colors i like most</h1>
<ul>
<li>
<p>red</p>
</li>
<li>
<p>green</p>
</li>
<li>
<p>blue</p>
</li>
</ul>
```

Please note that there is no json file in the output, it's consumed at compile
time so you don't need to worry about it.

In a similar way, you can [setup the _data directory](https://www.11ty.dev/docs/data-global/)
and provide global data for all your documents.

## And much more

Right now eleventy is at version 2.0 and already offers a wide range of plugins
and template languages to choose from.

The community is [quite active](https://github.com/11ty/eleventy/discussions)
and the documentation is quite good too.

I could extend that post for much longer, but if you got interested jus go over
the official docs.

The snippets for this blog post can be found
[here](https://github.com/sombriks/simple-sample-eleventy).

---
Tags:
{%- for tag in tags -%}
[{{tag}}](/blog/?tag={{tag | slugify}})
{%- endfor -%}

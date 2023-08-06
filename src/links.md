---
layout: base.webc
---
## Links

<br/>
{%- for link in links -%}
  <a  target="_blank"
      title="{{link.tags | join: ", "}}"
      href="{{link.link}}">{{link.label}}</a>
{%- endfor -%}

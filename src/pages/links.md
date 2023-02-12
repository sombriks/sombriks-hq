---
layout: base.webc
---

{%- for link in links -%}
  <a target="_blank" href="{{link.link}}" style="display:inline-block;">{{link.label}}</a>
{%- endfor -%}


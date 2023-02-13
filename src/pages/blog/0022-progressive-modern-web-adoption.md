---
layout: base.webc
tags: posts
date: 2020-08-01
---
# On progressive adoption of modern web development

It's no secret that there is still a lot of front-end solutions using 
[jQuery](https://jquery.com/). In order to sample how one can migrate from 
another web library foundation, let's present a gradual, progressive, approach
for the problem.

## Why don't just turn the key?

Tech stack is in fact a human issue. In order to adopt any technology, you need
people versed on that. Leaving jQuery doesn't mean leave the people that used to
maintain that.

## What about training?

It must happen. training alone, however won't present the all new caveats
regarding, for example, dealing with [Vue](https://vuejs.org/) SFC components.

## The progressive way

Instead of radical change, the new library can be adopted on new features and
paced upgrade on the existing ones. That way the new skills can be developed
over already known terrain without waste people's muscular memory. 

## Sample: todo-list jQuery

[This study](https://github.com/sombriks/sample-java-web-progressive-frontend)
shows the same do-do list using different approaches on frontend. 

First of all, the regular jQuery solution:

```javascript
function list() {
    $(".clone").remove()
    $.ajax("todo-json", {
        success: function (data) {
            if(!data.items.length)
                $("#parent").append("<h2 class='clone'>No available tasks</h2>")
            $.each(data.items, function (idx, item) {
                var todo = $("#_template").clone()
                todo.addClass("clone");
                todo.attr("id", "todo_" + item.id)
                todo.find(".input").val(item.description)
                todo.find("input[type=checkbox]")[item.done ? "attr" : "removeAttr"]("checked", "true")
                todo.find("button").on("click", function () {
                    $.ajax("todo-json", {
                        contentType: "application/json",
                        type: "POST",
                        data: JSON.stringify({
                            id: item.id,
                            description: todo.find(".input").val(),
                            done: todo.find("input[type=checkbox]").prop("checked")
                        }),
                        success: list
                    })
                })
                todo.css({display: ""})
                $("#parent").append(todo)
            })
        }
    })
}

list()

$("#add").on("click", function () {
    $.ajax("todo-json", {
        contentType: "application/json",
        type: "POST",
        data: JSON.stringify({
            description: $("#description").val()
        }),
        success: function () {
            list()
            $("#description").val("")
        }
    })
})
```

This script is imperative, concise, yet it needs to know the underlying document
in details:

```html
<html>
<head>
    <title>TODO List jQuery</title>
    <script src="js/libs/jquery.min.js"></script>
    <link rel="stylesheet" href="css/bulma.min.css"/>
</head>
<body>

<div class="level">
    <section class="container">
        <h1>Sample TODO list with jQuery</h1>
        <a href="todo">Back</a>
        <div class="tile is-vertical" id="parent">
            <div class="tile box">
                <div class="field has-addons">
                    <div class="control">
                        <input class="input" id="description" minlength="1" maxlength="30" placeholder="New task">
                    </div>
                    <div class="control">
                        <button id="add" class="button is-primary">ADD</button>
                    </div>
                </div>
            </div>
            <div id="_template" class="tile box level" style="display:none">
                <div class="field level-item">
                    <div class="control">
                        <input class="input" name="description" minlength="1" maxlength="30"
                               value="_template">
                    </div>
                </div>
                <div class="field level-item">
                    <div class="control">
                        <label class="checkbox">
                            <input name="done" type="checkbox" checked>
                            Done
                        </label>
                    </div>
                </div>
                <div class="field level-item">
                    <div class="control">
                        <button class="button is-primary">SAVE</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<script src="js/todo-jquery.js"></script>
</body>
</html>
```

### Drawbacks

- we need to know the html elements
- the `$.ajax` needs a explicit `JSON.stringify` call. most defaults does not
  make sense nowadays (form/urlencoded instead application/json)
- dirty namespace (anyone by accident could overwrite the `list` function)

## Sample: todo-list progressive Vue

We call it progressive because we're using it not in it's preferred mode, but
using it as classic javascript library with no bundlers, minifiers or special
components at all.

Why one would do that?

In short, jump from jQuery to webpack-enabled vue-cli project directly is like 
throw the shrimp in the cold-iced water. It might kill.

Enough talk, here's the code:

```javascript
window.todoVm = new Vue({
    data: {
        description: "",
        items: []
    },
    methods: {
        list() {
            this.items = []
            axios.get("todo-json").then(ret => {
                this.items = ret.items
            })
        },
        add() {
            axios.post("todo-json", {description: this.description}).then(_ => {
                this.list()
                this.description = ""
            })
        },
        save(item) {
            axios.post("todo-json", item).then(this.list)
        }
    },
    mounted() {
        this.list()
    }
}).$mount("#parent")
```

This script is mainly declarative, concise and barely knows the underlying html
content:

```html
<html>
<head>
    <title>TODO List Vue</title>
    <script src="js/libs/vue.min.js"></script>
    <script src="js/libs/axios.min.js"></script>
    <link rel="stylesheet" href="css/bulma.min.css"/>
</head>
<body>
<div class="level">
    <section class="container">
        <h1>Sample TODO list with Vue</h1>
        <a href="todo">Back</a>
        <div class="tile is-vertical" id="parent">
            <div class="tile box">
                <div class="field has-addons">
                    <div class="control">
                        <input class="input" v-model="description" minlength="1" maxlength="30" placeholder="New task">
                    </div>
                    <div class="control">
                        <button class="button is-primary" @click="add">ADD</button>
                    </div>
                </div>
            </div>
            <div class="tile box level" v-for="item in items" :key="item.id">
                <div class="field level-item">
                    <div class="control">
                        <input class="input" name="description" minlength="1" maxlength="30"
                               v-model="item.description">
                    </div>
                </div>
                <div class="field level-item">
                    <div class="control">
                        <label class="checkbox">
                            <input name="done" type="checkbox" v-model="item.done">
                            Done
                        </label>
                    </div>
                </div>
                <div class="field level-item">
                    <div class="control">
                        <button @click="save(item)" class="button is-primary">SAVE</button>
                    </div>
                </div>
            </div>
            <h2 v-if="!items.length">No available tasks</h2>
        </div>
    </section>
</div>
<script src="js/todo-vue.js"></script>
</body>
</html>
```

Markup is almost the same, which is good if you think about it. It's paced
migration.

Key differences are the lack of almost all id's and the presence of vue special 
attributes.

## How to boil a frog

Once the team face no challenge writing reactive frontend code, one can start to
think about the complete state-of-the-art frontend stack.

It's important to upgrade technology and mindsets, however it take time. Hit the
correct pace and profit on it!

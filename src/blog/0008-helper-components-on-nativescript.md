---
layout: blog-layout.pug
tags: 
  - posts
  - vue
  - nativescript
date: 2019-01-03
---
# Helper components on nativescript-vue

This is a quick one, but is quite worth to share so be prepared.

The [nativescript](https://nativescript-vue.org/en/docs/introduction/)
framework (better, platform!) is one of those hopes that makes you stick with
mobile hybrid solutions a little more without lose that much of performance.

That said, this time let's spare you from the tedious phase of setup an entire
universe just to see one thing. See the
[getting started](https://nativescript-vue.org/en/docs/getting-started/installation/)
or see the [playground](https://nativescript-vue.org/en/docs/getting-started/playground-tutorial/)
tutorial that those nice people from nativescript team did, those are a nice
way to know a little about what nativescript really can do.

## My problem

The [DatePicker](https://nativescript-vue.org/en/docs/elements/components/date-picker/)
component allows user to manipulate a date and then we can use it on whatever
we want. It is however better presented inside a dialog because of course it is
better inside a [modal](https://nativescript-vue.org/en/docs/routing/manual-routing/#showmodal)
than brutally placed inline, stealing space and the user attention.

## The solution

At first the two pieces are clear: a button to shoot up the modal and a custom
vue component to present the DatePicker and a way to send back the date.

First a sample of the _master_

{% raw %}

```html
<!-- MainForm.vue -->
<template>
  <Page>
    <StackLayout>
      <TextField hint="Describe the event" v-model="event.event_description" />
      <button @tap="pickdate">{{seldate}}</button>
      <!-- other fields ommited -->
    </StackLayout>
  </Page>
</template>
<script>
  import moment from "moment";
  import ModalPicker from "./ModalPicker.vue";
  export default {
    name: "main-form",
    data: _ => ({
      event: {
        event_description: "",
        event_date: new Date()
      }
    }),
    computed: {
      seldate() {
        return moment(this.event.event_date).format("YYYY-MM-DD");
      }
    },
    methods: {
      pickdate() {
        this.$showModal(ModalPicker, {
          props: { current: this.event.event_date }
        }).then(ret => (this.event.event_date = ret));
      }
    }
  };
</script>
```

{% endraw %}

And this is the _detail_

```html
<!-- modal-picker.vue -->
<template>
  <Page>
    <StackLayout>
      <DatePicker v-model="date" />
      <button @tap="$modal.close(date)">Choose</button>
    </StackLayout>
  </Page>
</template>
<script>
  export default {
    props: ["current"],
    name: "modal-picker",
    data: _ => ({ 
        date: new Date() 
    }),
    mounted() {
      this.date = this.current;
    }
  };
</script>
```

This is a quite nice approach. However, there is this first class
_.vue component_ hanging around completely dependent (see the `props` and
`$modal.close` thing) of a very precise and correct `$showModal` call.

This is not a true complete component at all. It isn't also just a function.

## The other solution

So, the .vue file is also a first class
[javascript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).
Therefore it's possible to define any other class, function, variable, etc.
Only the export part is compromised.

So why not define two vue components but only one be the default export?

See it:

```html
<!-- MainForm.vue -->
<template>
  <Page>
    <StackLayout>
      <TextField hint="Describe the event" v-model="event.event_description" />
      <button @tap="pickdate">{{seldate}}</button>
      <!-- other fields ommited -->
    </StackLayout>
  </Page>
</template>
<script>
  import moment from "moment";
  // detail
  const ModalPicker = {
    props: ["current"],
    name: "modal-picker",
    data: _ => ({ date: new Date() }),
    mounted() {
      this.date = this.current;
    },
    template:`
      <Page>
        <StackLayout>
          <DatePicker v-model="date" />
          <button @tap="$modal.close(date)">Choose</button>
        </StackLayout>
      </Page>
    `
  }
  // master
  export default {
    name: "main-form",
    data: _ => ({
      event: {
        event_description: "",
        event_date: new Date()
      }
    }),
    computed: {
      seldate() {
        return moment(this.event.event_date).format("YYYY-MM-DD");
      }
    },
    methods: {
      pickdate() {
        this.$showModal(ModalPicker, {
          props: { current: this.event.event_date }
        }).then(ret => (this.event.event_date = ret));
      }
    }
  };
</script>
```

Now the slave component is contained inside it's master workflow.

Seems so little yet it saves you the time of switching from files and contexts.

Also it's pretty nice remember that virtually nothing on vue ecosystem is a
rigid taboo. Keep it simple and creative.

## Conclusion

Nativescript-Vue grows as a good alternative to cordova/ionic and react-native.
Hope to see more plugins, components, and, why not, more
[showcases](https://market.nativescript.org/?tab=samples&framework=vue&category=all_samples)
of it's potential.

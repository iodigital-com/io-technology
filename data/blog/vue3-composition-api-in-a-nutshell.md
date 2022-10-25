---
title: 'Vue 3 composition API in a nutshell'
date: '2022-10-25'
tags: ['developtment', 'frontend', 'vue']
images: ['/articles/vue3-composition-api-in-a-nutshell/header.png']
summary: ''
authors: ['lars-janssen']
theme: 'black'
---

Vue 3 has been released on Monday, February 7, 2022. Since the release of vue 3 the ecosystem got a boost (with for example Vite) and
the options API has been introduced. In this article I will explain some core concepts of the options API.

## What's the composition API?

With the arrival of Vue 3 we can declare components with the `options API` (old way) or the `composition API` (new way). The composition API is a set of APIs that allows us to author Vue components using imported functions instead of declaring options.

With the composition API the vue components are more structured and readable, this can be very helful especially when components grow. The following image displays more structured components.

![vue3-options-api-composition-api](/articles/vue3-composition-api-in-a-nutshell/options-api-composition-api.png)

According to the official vue documentation the most important benefits are:

- Better logic Reuse;
- More flexible code organization;
- Better type inference;
- Smaller production bundle and less overhead.

### Setup

With the composition API we can declare our vue template in 2 different ways:

Method 1:

```js
<script setup>const aProperty: string = 'Test';</script>
```

Method 2:

```js
<script>
    export default {
        setup() {
            const state = reactive({ aProperty: 'Test' });

            return {
                state
            }
        }
    }
</script>
```

Both methods are working but in practise most developer use method 1, because
it's more readable and less code is needed.

### Hooks

The composition API is using hooks instead of integrated functions. With the options API we had
to define integrated functions like this:

```js
export default {
  mounted() {
    //Logic
  },

  data() {
    //Data
  },

  watch: {
    //Watch data
  },
}
```

With the composition API we can use hooks for this:

```js
onMounted(() => {
  //Logic
})

const dataProperty: string = ref('')

watch(() => {
  //Watch data
})
```

### Props

Vue 3 has been rewritten in typescript. We notice this well as typescript can be better integrated into our application. Props are a good example of this. With the options API:

```js
props: {
    dogNames: {
        type: Array,
        default: []
    }
}
```

In vue 2 you could already define a type, but this was still quite limited. You now have the option to use interfaces. With the composition API:

```js
interface Props {
  dogNames: Array<String>;
}

let props = withDefaults(defineProps<Props>(), {
  dogNames: [],
});
```

### Events

When dispatching events to our parent components we notice the increased typescript support aswel. Types
can be declared so the developer knows if a incorrect value is being passed. Composition API:

```js
const emit = defineEmits<{
  (event: "dogNames", value: Array<string>): void;
}>();

emit('dogNames', ['Snuffel']);
```

With the options API:

```js
$emit('dogNames', ['Snuffel'])
```

### Multiple v-models

One of the most requested features was multiple `v-models`, with vue3 it's finally there. Before we had to pass additional
data as props.

```js
<AnimalComponent v-model="dogNames" catNames="catNames" />
```

Now we can use multiple `v-models` like this:

```js
<AnimalComponent v-model:dogNames="dogNames" v-model:catNames="catNames" />
```

In the child component (`AnimalComponent`) we can emit the value back to our parent. Vue is listening for a default naming convention
`update:<name>`.

```js
const emit = defineEmits<{
  (event: "update:dogNames", value: Array<string>): void;
  (event: "update:catNames", value: Array<string>): void;
}>();
```

### Final thoughts

Vue 3 has been a huge update compared to Vue 2. You could almost see it as a new framework rather than an update. Within IO, a number of projects are now done in vue3, in which I participate. In the beginning I had to get used to the new structure of vue and the composition API. Now I see the benefits more and more, and understand why this update was necessary. Especially the typescript integration is very good, and with hooks we reuse our code more easily and is it more readable.

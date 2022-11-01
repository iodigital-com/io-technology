---
title: 'Vue 3 composition API in a nutshell'
date: '2022-11-01'
tags: ['development', 'frontend', 'Vue 2', 'Vue 3']
images: ['/articles/vue3-composition-api-in-a-nutshell/header.png']
summary: 'Vue 3 has been launched with the composition API. In this article we dive deeper into this subject and compare it with the options API (old way).'
authors: ['lars-janssen']
theme: 'black'
---

Vue 3 has been released on Monday, February 7, 2022. Since the release of Vue 3 the ecosystem got a boost (for example with Vite) and
the composition API has been introduced. In this article I will explain some core concepts of the composition API.

## What is the composition API?

With the arrival of Vue 3 we can declare components with the `options API` (old way) or the `composition API` (new way). The composition API is a set of APIs that allows us to author Vue components using imported functions instead of declaring options.

With the composition API the Vue components are more structured and readable, this can be very helpful especially when components grow. The following image displays more structured components.

![vue3-options-api-composition-api](/articles/vue3-composition-api-in-a-nutshell/options-api-composition-api.png)

According to the official Vue documentation, the most important benefits are:

- Better reusability of logic;
- More flexible code organization;
- Better type inference;
- Smaller production bundle and less overhead.

### Setup

With the composition API we can declare our Vue template in 2 different ways:

Method 1:

```ts
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

Both methods are working in practice most developer use method 1, it's more readable and less code is needed.

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

Vue 3 has been rewritten in Typescript. The integration of Vue in our TypeScript application is now more smooth since Vue 3 is rewritten in TypeScript. Props are a good example of this. With the options API:

```js
props: {
    dogNames: {
        type: Array,
        default: []
    }
}
```

In Vue 2 you could already define a type, but this was still quite limited. You now have the option to use interfaces. With the composition API:

```ts
interface Props {
  dogNames: Array<String>
}

let props = withDefaults(defineProps<Props>(), {
  dogNames: [],
})
```

### Events

When dispatching events to our parent components we notice the better Typescript support as well. Types
can be declared so the developer knows if an incorrect value is being passed. Composition API:

```ts
const emit = defineEmits<{
  (event: 'dogNames', value: Array<string>): void
}>()

emit('dogNames', ['Snuffel'])
```

With the options API:

```js
$emit('dogNames', ['Snuffel'])
```

### Code reusage with hooks

With the options API duplicate code is prevented with `mixins`. When using multiple mixins you quickly lose the overview and are often wondering where data or logic comes from. With the composition API we can use our own hooks for this.

```ts
const useGetPreferences = () => {
  return useQuery(['Preference'], async () =>
    PreferencesService.getPreferences().then(({ data }) => data)
  )
}

export { useGetPreferences }
```

It's used like this:

```ts
const { data: preferences } = useGetPreferences()
```

With the options API:

```js
var mixin = {
  methods: {
    useGetPreferences() {
      return useQuery(['Preference'], async () =>
        PreferencesService.getPreferences().then(({ data }) => data)
      )
    },
  },
}
```

It's used like this:

```js
new Vue({
  mixins: [mixin],
})
```

## Composition API and options API together

Maybe you are wondering if it is possible to use these API's together? Yes, that's possible! If you want to migrate a project to the composition api, this is very useful. However, for the future, the composition API will become the standard.

## Final thoughts

Vue 3 has been a huge update compared to Vue 2. You could almost see it as a new framework rather than an update. Within iO, a number of projects are now done in Vue 3, in which I participate. In the beginning I had to get used to the new structure of Vue and the composition API. Now I see the benefits more and more, and understand why this update was necessary. Especially the Typescript integration is very good, and with hooks we reuse our code more easily and is it more readable.

# Chapter 3: Reactivity — `ref`, `reactive`, `computed`

## The Core Concept

Vue 3's reactivity system wraps data in **Proxy** objects. When you read or write the data, Vue can track dependencies and trigger re-renders automatically.

## `ref` — Wrapping Primitives

```vue
<!-- Template -->
<script setup>
const count = ref(0)
const name = ref('Vue')
</script>
<template>
  <p>{{ count }} — {{ name }}</p>
  <!-- Auto-unwrapped: Vue knows it's a ref and extracts .value for you -->
</template>
```

```tsx
// TSX
const count = ref(0)
const name = ref('Vue')

// In the render function:
return () => (
  <p>{count.value} — {name.value}</p>
  //  ↑ Must manually write .value!
)
```

**This is the #1 gotcha for template developers moving to TSX.** Template auto-unwraps refs; TSX does not.

## `reactive` — Wrapping Objects

```ts
const state = reactive({
  count: 0,
  name: 'Vue'
})
```

```vue
<!-- Template -->
<template>
  <p>{{ state.count }} — {{ state.name }}</p>
  <!-- reactive objects are NOT unwrapped, access properties directly -->
</template>
```

```tsx
// TSX — same as template here!
return () => (
  <p>{state.count} — {state.name}</p>
)
```

`reactive` does NOT need `.value` in either template or TSX because the object itself is the proxy.

## `computed` — Derived State

```ts
const count = ref(2)
const doubled = computed(() => count.value * 2)
```

```vue
<!-- Template -->
<template>
  <p>{{ doubled }}</p>
  <!-- Auto-unwrapped! -->
</template>
```

```tsx
// TSX — needs .value!
return () => <p>{doubled.value}</p>
```

`computed()` returns a `ComputedRef`, which is a special kind of ref — it also needs `.value` in TSX.

## Unwrapping Rules Cheat Sheet

| API | Template | TSX |
|-----|----------|-----|
| `ref(0)` | `{{ count }}` | `{count.value}` |
| `reactive({ x: 1 })` | `{{ state.x }}` | `{state.x}` |
| `computed(() => x)` | `{{ doubled }}` | `{doubled.value}` |
| ref inside reactive | Auto-unwrapped | Auto-unwrapped |
| `ref([])` | `{{ list[0] }}` | `{list.value[0]}` |

## Why This Difference?

The Vue **template compiler** adds a special step: it detects `{{ count }}` and automatically inserts `.value` access. This only works in `.vue` files because the compiler can analyze the template at build time.

In `.tsx` files, there is no template compiler — the JSX is compiled by standard JSX transformers (like `@vitejs/plugin-vue-jsx`), which don't do ref unwrapping. Hence, `.value` is required.

## Ref in reactive: The Exception

When a ref is stored inside a reactive object, it IS automatically unwrapped:

```ts
const count = ref(0)
const state = reactive({ count })

console.log(state.count) // 0 — no .value!
state.count = 1          // Works!
console.log(count.value) // 1 — the ref was updated
```

This works identically in template and TSX.

## Demo Location

| File | What it shows |
|------|---------------|
| `src/composables/useTodos.ts` | `reactive([])` for list, `ref('all')` for filter, `computed` for `filteredList` and `stats` |
| `src/components/TodoInput.tsx` | `ref('')` for input text, `ref<HTMLInputElement>()` for DOM ref |
| `src/App.tsx` | `ref(false)` for modal state |

## Exercise

Look at `src/composables/useTodos.ts` and identify:
1. Which variables are `ref` vs `reactive`?
2. Why is `list` using `reactive` instead of `ref`?
3. Find all `.value` usages — which ones would disappear in a template?

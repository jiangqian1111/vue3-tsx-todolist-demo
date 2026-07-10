# Chapter 1: From Vue Template to TSX

## Why TSX?

Vue's `<template>` is compiled into **render functions** at build time. TSX (or JSX) lets you write those render functions **directly** — skipping the compilation step and giving you the full power of JavaScript.

```
Vue Template (.vue)       →  Vue Compiler  →  Render Function  →  Virtual DOM  →  Real DOM
TSX (.tsx)                →  skip          →  Render Function  →  Virtual DOM  →  Real DOM
```

## Template vs TSX: Side by Side

### Text Interpolation

```vue
<!-- Template -->
<template>
  <div>{{ message }}</div>
</template>
<script setup>
const message = ref('Hello')
</script>
```

```tsx
// TSX
export default defineComponent({
  setup() {
    const message = ref('Hello')
    return () => <div>{message.value}</div>
    //              ↑    ↑
    //          no {{ }}  need .value!
  }
})
```

**Key point**: Template auto-unwraps refs (`{{ message }}`). In TSX, you must write `{message.value}`.

### Conditional Rendering

```vue
<!-- Template: v-if -->
<div v-if="show">Visible</div>
<div v-else>Hidden</div>
```

```tsx
// TSX: JavaScript && operator
{show.value && <div>Visible</div>}
{!show.value && <div>Hidden</div>}

// Or ternary:
{show.value ? <div>Visible</div> : <div>Hidden</div>}
```

### List Rendering

```vue
<!-- Template: v-for -->
<li v-for="item in list" :key="item.id">
  {{ item.task }}
</li>
```

```tsx
// TSX: .map()
{list.map(item => (
  <li key={item.id}>{item.task}</li>
))}
```

### Event Binding

```vue
<!-- Template -->
<button @click="handleAdd">Add</button>
<input @keyup.enter="handleAdd" />
```

```tsx
// TSX
<button onClick={handleAdd}>Add</button>
<input onKeyup={(e) => e.key === 'Enter' && handleAdd()} />
```

### Attribute Binding

```vue
<!-- Template -->
<div :class="{ active: isActive }">Hello</div>
<img :src="imageUrl" />
```

```tsx
// TSX
<div class={isActive.value ? 'active' : ''}>Hello</div>
<img src={imageUrl.value} />
```

## Quick Reference Table

| Feature | Template | TSX |
|---------|----------|-----|
| Text | `{{ msg }}` | `{msg.value}` |
| Condition | `v-if="ok"` | `{ok.value && <X/>}` |
| Loop | `v-for="i in list"` | `{list.map(i => ...)}` |
| Click | `@click="fn"` | `onClick={fn}` |
| Keyup | `@keyup.enter="fn"` | `onKeyup={e => e.key==='Enter' && fn()}` |
| Class | `:class="cls"` | `class={cls.value}` |
| Style | `:style="sty"` | `style={sty}` |
| Model | `v-model="x"` | `v-model={x.value}` |
| Ref | `ref="x"` | `ref={x}` (object) |
| Slot | `<slot />` | `{slots.default?.()}` |

## Where in the Demo?

Every `.tsx` file in `src/` demonstrates this conversion. Start with:
- `src/App.tsx` — the main page, shows conditionals, lists, events
- `src/components/TodoInput.tsx` — shows v-model, events, refs

## Exercise

Open `src/App.tsx` and find **3 more** examples of Template → TSX conversion that are not in the table above.

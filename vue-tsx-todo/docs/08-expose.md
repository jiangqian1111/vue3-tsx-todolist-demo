# Chapter 8: Expose & Template Refs

## Two Kinds of Refs

In Vue, `ref` serves two different purposes:

1. **DOM ref**: Binds to an HTML element → gives you the DOM node
2. **Component ref**: Binds to a child component → gives you the component instance

Both use the same syntax, but they return different things.

## DOM Refs

Get a reference to an actual DOM element:

```vue
<!-- Template -->
<script setup>
import { ref, onMounted } from 'vue'
const inputEl = ref(null)
onMounted(() => {
  inputEl.value.focus()
})
</script>
<template>
  <input ref="inputEl" />
</template>
```

```tsx
// TSX
setup() {
  const inputEl = ref<HTMLInputElement>()  // Type: HTMLInputElement | undefined

  onMounted(() => {
    inputEl.value?.focus()
  })

  return () => <input ref={inputEl} />
}
```

## Component Refs

Get a reference to a child component instance:

```vue
<!-- Template -->
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'
const childRef = ref(null)
</script>
<template>
  <Child ref="childRef" />
  <button @click="childRef.someMethod()">Call</button>
</template>
```

```tsx
// TSX
setup() {
  const childRef = ref<SomeExposedType>()

  return () => (
    <div>
      <Child ref={childRef} />
      <button onClick={() => childRef.value?.someMethod()}>
        Call
      </button>
    </div>
  )
}
```

## The `expose()` Function

By default, a component instance exposes **all** variables returned from setup. This means the parent can access internal state:

```tsx
// Child — NO expose()
setup() {
  const secret = ref('hidden')
  const visible = () => console.log('hello')

  return { secret, visible }
}

// Parent — can see everything!
childRef.value.secret  // 'hidden' — internal state exposed!
childRef.value.visible // () => console.log('hello')
```

`expose()` lets you **control** what's visible:

```tsx
// Child — WITH expose()
setup(props, { expose }) {
  const secret = ref('hidden')      // Private
  const visible = () => console.log('hello')  // Public

  expose({ visible })
  // secret is NOT exposed!
}

// Parent — can only see what's exposed
childRef.value.secret  // undefined!
childRef.value.visible // ✅ Works
```

## Type Safety with `expose()`

For full TypeScript support, export an interface matching the exposed methods:

```tsx
// TodoInput.tsx
export interface TodoInputExposed {
  focus: () => void
  clear: () => void
}

export default defineComponent({
  setup(props, { expose }) {
    const focus = () => { /* ... */ }
    const clear = () => { /* ... */ }
    expose({ focus, clear })

    return () => <input ... />
  }
})

// App.tsx
import TodoInput, { type TodoInputExposed } from './components/TodoInput'

const inputComp = ref<TodoInputExposed>()

// TS knows these exist:
inputComp.value?.focus()  // ✅ TypeScript approves
inputComp.value?.clear()  // ✅ TypeScript approves
inputComp.value?.text     // ❌ TypeScript error — not in interface
```

## Demo Location

| File | What it shows |
|------|---------------|
| `src/components/TodoInput.tsx` | Exports `TodoInputExposed` interface, calls `expose({ focus, clear })` |
| `src/App.tsx` | `ref<TodoInputExposed>()`, binds to `<TodoInput ref={inputComp} />`, calls `inputComp.value?.focus()` and `inputComp.value?.clear()` |

## Summary

| | Template | TSX |
|--|----------|-----|
| DOM ref | `ref="el"` | `ref={el}` (object) |
| Component ref | `ref="comp"` | `ref={comp}` (object) |
| Expose | `defineExpose({...})` | `expose({...})` |
| Type safety | Manual | Interface + ref\<Interface\> |

**Best practice**: Always `expose()` only what's needed, and always export a matching TypeScript interface.

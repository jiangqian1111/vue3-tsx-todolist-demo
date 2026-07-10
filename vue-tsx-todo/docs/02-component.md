# Chapter 2: Component Definition — `defineComponent`

## Template Way

In `.vue` files, you define components using `<script setup>` or the Options API:

```vue
<!-- Option A: <script setup> (recommended in Vue3) -->
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
<template>
  <button @click="count++">{{ count }}</button>
</template>

<!-- Option B: Options API -->
<script lang="ts">
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
</script>
```

## TSX Way

In `.tsx` files, use `defineComponent`:

```tsx
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CounterButton',

  setup() {
    const count = ref(0)

    // Return a render function
    return () => (
      <button onClick={() => count.value++}>
        {count.value}
      </button>
    )
  }
})
```

## Why `defineComponent`?

1. **TypeScript inference** — Vue can infer prop types, emit types, etc.
2. **Same API** — works with Options API or Composition API
3. **Compiler hint** — tells Vite/Vue this is a component, not a plain object

## Anatomy of a TSX Component

```tsx
export default defineComponent({
  // 1. Component name (shows in DevTools)
  name: 'MyComponent',

  // 2. Props definition
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 }
  },

  // 3. Emitted events
  emits: ['update', 'delete'],

  // 4. Setup function — runs once when component is created
  setup(props, { emit, slots, expose, attrs }) {
    // Reactive state
    const localCount = ref(0)

    // Methods
    const handleClick = () => {
      emit('update', localCount.value)
    }

    // Lifecycle
    onMounted(() => {
      console.log('Mounted!')
    })

    // Render function
    return () => (
      <div onClick={handleClick}>
        {props.title}: {props.count}
      </div>
    )
  }
})
```

## Common Mistakes

### Forgetting to return a function

```tsx
// ❌ Wrong: returns JSX directly
setup() {
  return <div>hello</div>
}

// ✅ Correct: returns () => JSX
setup() {
  return () => <div>hello</div>
}
```

### Forgetting props are reactive but accessed synchronously

```tsx
setup(props) {
  // props is reactive — it updates when parent re-renders
  // But you access it directly: props.title (NOT props.title.value)
  return () => <div>{props.title}</div>
}
```

## Demo Location

| File | What it shows |
|------|---------------|
| `src/App.tsx` | Root component with setup() returning full page render |
| `src/components/TodoInput.tsx` | Component with props, emits, expose, lifecycle |
| `src/components/TodoItem.tsx` | Component with props, emits, slots, inject |
| `src/components/TodoModal.tsx` | Component with Teleport, v-model pattern |

## Summary

- **Template**: `<script setup>` or `export default { ... }`
- **TSX**: `defineComponent({ setup() { return () => JSX } })`
- `defineComponent` is just a wrapper for TypeScript — at runtime it's a plain object
- `setup()` returns a **render function** (not JSX directly)

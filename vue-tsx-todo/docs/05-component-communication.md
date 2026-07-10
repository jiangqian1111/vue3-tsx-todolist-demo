# Chapter 5: Component Communication — Props & Emits

## Data Flow Direction

```
Parent Component
   │
   ├── Props ──────────────►  Child Component  (data down)
   │
   └── ◄─── Emits (events)    Child Component  (events up)
```

## Props — Parent to Child

### Defining Props

```vue
<!-- Template: defineProps -->
<script setup lang="ts">
const props = defineProps({
  task: { type: String, required: true },
  done: { type: Boolean, default: false }
})
</script>
```

```tsx
// TSX: props in defineComponent
export default defineComponent({
  props: {
    task: { type: String, required: true },
    done: { type: Boolean, default: false }
  },
  setup(props) {
    // Access: props.task, props.done
    return () => <div>{props.task}</div>
  }
})
```

### Passing Props

```vue
<!-- Template -->
<TodoItem :task="item.task" :done="item.done" />
```

```tsx
// TSX — single brace, no colon prefix
<TodoItem task={item.task} done={item.done} />
```

**Pattern**: `:prop="val"` → `prop={val}` (remove colon, wrap in single braces)

## Emits — Child to Parent

### Defining & Emitting

```vue
<!-- Template -->
<script setup>
const emit = defineEmits(['toggle', 'del'])
</script>
<button @click="emit('toggle')">Toggle</button>
<div @click="$emit('del')">Delete</div>
```

```tsx
// TSX
export default defineComponent({
  emits: ['toggle', 'del'],
  setup(props, { emit }) {
    return () => (
      <div>
        <button onClick={() => emit('toggle')}>Toggle</button>
        <button onClick={() => emit('del')}>Delete</button>
      </div>
    )
  }
})
```

### Listening

```vue
<!-- Template -->
<TodoItem @toggle="handleToggle" @del="handleDel" />
```

```tsx
// TSX
<TodoItem onToggle={handleToggle} onDel={handleDel} />
```

**Pattern**: `@event="fn"` → `onEvent={fn}`

## The `v-model` Pattern

`v-model` is just syntactic sugar for `:prop + @update:prop`:

```vue
<!-- Template sugar -->
<TodoModal v-model:visible="isOpen" />

<!-- Template desugared -->
<TodoModal :visible="isOpen" @update:visible="val => isOpen = val" />
```

```tsx
// TSX — no v-model sugar for custom components
<TodoModal
  visible={isOpen.value}
  onUpdate:visible={(val) => isOpen.value = val}
/>
```

In the child component:

```vue
<!-- Template -->
<script setup>
const emit = defineEmits(['update:visible'])
</script>
<button @click="emit('update:visible', false)">Close</button>
```

```tsx
// TSX
export default defineComponent({
  props: { visible: Boolean },
  emits: ['update:visible'],
  setup(props, { emit }) {
    return () => (
      <button onClick={() => emit('update:visible', false)}>
        Close
      </button>
    )
  }
})
```

## Demo Location

| File | What it shows |
|------|---------------|
| `src/components/TodoItem.tsx` | Defines `props: { task, done }`, `emits: ['toggle', 'del']` |
| `src/App.tsx` | Passes `task={item.task}` and listens `onToggle={...}` |
| `src/components/TodoModal.tsx` | Full v-model pattern: prop `visible` + emit `update:visible` |
| `src/components/TodoInput.tsx` | `emits: ['add']` — child notifies parent of new task |

## Summary

| | Template | TSX |
|--|----------|-----|
| Prop definition | `defineProps([...])` | `props: { ... }` |
| Prop access | `props.task` | `props.task` (same!) |
| Passing prop | `:task="val"` | `task={val}` |
| Emit definition | `defineEmits([...])` | `emits: [...]` |
| Emit call | `$emit('event')` | `emit('event')` |
| Emit listening | `@event="fn"` | `onEvent={fn}` |
| v-model (element) | `v-model="x"` | `v-model={x.value}` |
| v-model (component) | `v-model:visible` | Manual `prop + onUpdate:prop` |

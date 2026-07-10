# Chapter 10: Advanced Topics

A collection of advanced Vue3 TSX patterns demonstrated in this project.

---

## 1. Composables

### What Is a Composable?

A composable is a **function that uses Vue's Composition API** to encapsulate reusable logic. It can contain `ref`, `reactive`, `computed`, `watch`, lifecycle hooks, and any other Vue feature.

### Template Equivalent

In Options API, related logic is split across different options:

```vue
<script>
export default {
  data() { return { list: [], filter: 'all' } },
  computed: {
    filteredList() {
      if (this.filter === 'done') return this.list.filter(i => i.done)
      return this.list
    }
  },
  watch: {
    list: { handler(val) { localStorage.setItem('todos', JSON.stringify(val)) }, deep: true }
  },
  mounted() {
    const saved = localStorage.getItem('todos')
    if (saved) this.list = JSON.parse(saved)
  },
  methods: { add(task) { this.list.push({ id: Date.now(), task, done: false }) } }
}
</script>
```

### TSX Composable

All the logic is in one function:

```tsx
// composables/useTodos.ts
export function useTodos(storageKey = 'todos') {
  const list = reactive<Todo[]>([])
  const filter = ref<FilterType>('all')

  const filteredList = computed(() => {
    switch (filter.value) { /* ... */ }
  })

  onMounted(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) list.splice(0, list.length, ...JSON.parse(saved))
  })

  watch(
    () => [...list],
    (val) => localStorage.setItem(storageKey, JSON.stringify(val))
  )

  const add = (task: string) => list.push({ id: Date.now(), task, done: false })
  const remove = (id: number) => { /* ... */ }
  const toggle = (id: number) => { /* ... */ }

  return { list, filter, filteredList, add, remove, toggle }
}
```

### Usage

```tsx
// In any component:
const todo = useTodos('my-todos')
todo.add('New task')
console.log(todo.filteredList.value)
```

**Demo**: `src/composables/useTodos.ts`

---

## 2. Transition / TransitionGroup

### Transition — Single Element

Animates an element entering or leaving the DOM.

```vue
<!-- Template -->
<Transition name="fade">
  <div v-if="show">Hello</div>
</Transition>
```

```tsx
// TSX — conditional inside Transition
<Transition name="fade">
  {show.value && <div>Hello</div>}
</Transition>
```

### TransitionGroup — List Animations

Animates multiple elements being added, removed, or reordered.

```vue
<!-- Template -->
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</TransitionGroup>
```

```tsx
// TSX
<TransitionGroup name="list" tag="ul">
  {items.value.map(item => (
    <li key={item.id}>{item.text}</li>
  ))}
</TransitionGroup>
```

### CSS Classes

When `name="todo"` is set, Vue adds these CSS classes automatically:

| Class | When | Purpose |
|-------|------|---------|
| `.todo-enter-from` | First frame of entering | `opacity: 0; transform: translateX(-24px)` |
| `.todo-enter-active` | During entering | `transition: all 0.35s ease` |
| `.todo-enter-to` | Last frame (can omit) | Default to element's normal style |
| `.todo-leave-from` | First frame of leaving (can omit) | Default to element's normal style |
| `.todo-leave-active` | During leaving | `transition: all 0.3s ease; position: absolute` |
| `.todo-leave-to` | Last frame of leaving | `opacity: 0; transform: translateX(24px)` |
| `.todo-move` | When siblings move | `transition: transform 0.3s ease` |

**Important**: Set `position: absolute` on `.todo-leave-active` so the leaving element doesn't take up space, allowing `.todo-move` to animate the remaining elements upward.

**Demo**: `src/App.tsx` (TransitionGroup for todo list, Transition for modal), `src/styles.css` (animation classes)

---

## 3. Teleport

Renders content to a different DOM location, bypassing parent CSS constraints.

```vue
<!-- Template -->
<Teleport to="body">
  <div class="modal">Modal content</div>
</Teleport>
```

```tsx
// TSX — identical syntax!
<Teleport to="body">
  {props.visible && (
    <div class="modal">
      {slots.default?.()}
    </div>
  )}
</Teleport>
```

**Why use Teleport**: Modals need to escape parent containers with `overflow: hidden` or `transform` that would clip them.

**Demo**: `src/components/TodoModal.tsx`

---

## 4. Conditional Rendering

```vue
<!-- Template -->
<div v-if="loading">Loading...</div>
<div v-else-if="error">Error: {{ error }}</div>
<div v-else>Content</div>
```

```tsx
// TSX — use ternary or && chains
{loading.value ? (
  <div>Loading...</div>
) : error.value ? (
  <div>Error: {error.value}</div>
) : (
  <div>Content</div>
)}
```

---

## 5. List Rendering

```vue
<!-- Template -->
<li v-for="(item, index) in items" :key="item.id">
  {{ index }}: {{ item.name }}
</li>
```

```tsx
// TSX — .map() with index
{items.value.map((item, index) => (
  <li key={item.id}>
    {index}: {item.name}
  </li>
))}
```

Always provide a **unique `key`** prop for list items, just like in template.

---

## 6. `v-model` on Form Elements

```vue
<!-- Template -->
<input v-model="text" />
<textarea v-model="description" />
<select v-model="selected">
  <option value="a">A</option>
</select>
```

```tsx
// TSX — v-model directive still works!
<input v-model={text.value} />
<textarea v-model={description.value} />
<select v-model={selected.value}>
  <option value="a">A</option>
</select>
```

Vite's `@vitejs/plugin-vue-jsx` supports the `v-model` directive in JSX syntax.

---

## Quick Reference

| Feature | Template | TSX |
|---------|----------|-----|
| Composable | `useX()` in setup | Same |
| Transition | `<Transition name>` | `<Transition name>` |
| TransitionGroup | `<TransitionGroup>` | `<TransitionGroup>` |
| Teleport | `<Teleport to="body">` | `<Teleport to="body">` |
| Conditional | `v-if / v-else` | `&& / ternary` |
| List | `v-for="i in list"` | `{list.map(i => ...)}` |
| v-model (input) | `v-model="x"` | `v-model={x.value}` |

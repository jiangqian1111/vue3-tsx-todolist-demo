# Chapter 9: Lifecycle Hooks

## Good News: They're Identical

Vue lifecycle hooks work **exactly the same** in Template and TSX. There is zero difference in the API.

| Hook | When It Runs | Usage |
|------|-------------|-------|
| `onBeforeMount()` | Before DOM is created | Rarely used |
| `onMounted()` | After DOM is created | API calls, DOM queries, autofocus |
| `onBeforeUpdate()` | Before re-render | Debugging |
| `onUpdated()` | After re-render | Avoid modifying state here |
| `onBeforeUnmount()` | Before component is destroyed | Cleanup |
| `onUnmounted()` | After component is destroyed | Timers, event listeners |

## Template Usage

```vue
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const count = ref(0)
let timer

onMounted(() => {
  timer = setInterval(() => count.value++, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
```

## TSX Usage

```tsx
export default defineComponent({
  setup() {
    const count = ref(0)
    let timer: ReturnType<typeof setInterval>

    onMounted(() => {
      timer = setInterval(() => count.value++, 1000)
    })

    onUnmounted(() => {
      clearInterval(timer)
    })

    return () => <div>{count.value}</div>
  }
})
```

**The API is identical** — same imports, same placement, same behavior.

## Lifecycle in Composables

Lifecycle hooks work inside composables too:

```tsx
// composables/useTodos.ts
export function useTodos() {
  const list = reactive<Todo[]>([])

  onMounted(() => {
    // Restore from localStorage
    const saved = localStorage.getItem('todos')
    if (saved) {
      list.splice(0, list.length, ...JSON.parse(saved))
    }
  })

  return { list }
}
```

The hooks **automatically register** on the component that called the composable. No need to pass the component instance.

## Order of Execution

```
setup()
  ↓
onBeforeMount()
  ↓  (Vue creates DOM)
onMounted()
  ↓
  ... user interactions ...
  ↓
onBeforeUpdate()
  ↓  (Vue patches DOM)
onUpdated()
  ↓
  ... user leaves page ...
  ↓
onBeforeUnmount()
  ↓  (Vue destroys DOM)
onUnmounted()
```

## `nextTick()`

`nextTick()` waits for the next DOM update cycle. It's useful when you need to wait for Vue to render before accessing the DOM:

```tsx
onMounted(() => {
  nextTick(() => {
    // DOM is now fully rendered
    inputRef.value?.focus()
  })
})
```

This is needed because `onMounted` fires **before** the component's children are guaranteed to be rendered.

## Demo Location

| File | What it shows |
|------|---------------|
| `src/components/TodoInput.tsx` | `onMounted` + `nextTick` for input autofocus |
| `src/composables/useTodos.ts` | `onMounted` for localStorage restore |
| All components | Implicit lifecycle through composable calls |

## Summary

**Lifecycle hooks are the same in Template and TSX.** No syntax changes, no migration steps. The only difference is placement:

- **Template** (`<script setup>`): at the top level of the script
- **TSX**: inside the `setup()` function, before the render function

Both work in composables. Both receive no required parameters. Both auto-register on the current component.

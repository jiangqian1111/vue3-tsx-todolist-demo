# 第九章：生命周期钩子

## 好消息：完全相同

Vue 的生命周期钩子在 Template 和 TSX 中**完全一样**。API 没有任何区别。

| 钩子 | 执行时机 | 用途 |
|------|---------|------|
| `onBeforeMount()` | DOM 创建之前 | 很少使用 |
| `onMounted()` | DOM 创建之后 | API 调用、DOM 查询、自动聚焦 |
| `onBeforeUpdate()` | 重新渲染之前 | 调试 |
| `onUpdated()` | 重新渲染之后 | 避免在这里修改状态 |
| `onBeforeUnmount()` | 组件销毁之前 | 清理工作 |
| `onUnmounted()` | 组件销毁之后 | 清除定时器、事件监听器 |

## Template 用法

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

## TSX 用法

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

**API 完全相同**——同样的导入、同样的位置、同样的行为。

## 在 Composable 中使用生命周期

生命周期钩子也可以在 composable 内部使用：

```tsx
// composables/useTodos.ts
export function useTodos() {
  const list = reactive<Todo[]>([])

  onMounted(() => {
    // 从 localStorage 恢复数据
    const saved = localStorage.getItem('todos')
    if (saved) {
      list.splice(0, list.length, ...JSON.parse(saved))
    }
  })

  return { list }
}
```

钩子会**自动注册**到调用该 composable 的组件上。不需要传递组件实例。

## 执行顺序

```
setup()
  ↓
onBeforeMount()
  ↓ （Vue 创建 DOM）
onMounted()
  ↓
  ... 用户交互 ...
  ↓
onBeforeUpdate()
  ↓ （Vue 更新 DOM）
onUpdated()
  ↓
  ... 用户离开页面 ...
  ↓
onBeforeUnmount()
  ↓ （Vue 销毁 DOM）
onUnmounted()
```

## `nextTick()`

`nextTick()` 等待下一次 DOM 更新周期。当你需要等 Vue 渲染完毕后再访问 DOM 时非常有用：

```tsx
onMounted(() => {
  nextTick(() => {
    // DOM 此刻已完全渲染
    inputRef.value?.focus()
  })
})
```

之所以需要这样做，是因为 `onMounted` 在**子组件**确保渲染完成之前就会触发。

## Demo 中对应的文件

| 文件 | 展示内容 |
|------|---------|
| `src/components/TodoInput.tsx` | `onMounted` + `nextTick` 实现输入框自动聚焦 |
| `src/composables/useTodos.ts` | `onMounted` 实现 localStorage 数据恢复 |
| 所有组件 | 通过调用 composable 间接使用生命周期 |

## 小结

**生命周期钩子在 Template 和 TSX 中完全相同。** 没有语法变化，不需要迁移步骤。唯一的区别是放置位置：

- **Template**（`<script setup>`）：在 script 的顶层
- **TSX**：在 `setup()` 函数内部，渲染函数之前

二者都可以在 composable 中使用。都不需要传递额外参数。都自动注册到当前组件上。

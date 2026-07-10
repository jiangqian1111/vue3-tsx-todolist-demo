# 第十章：高级主题

本 Demo 项目中涉及的高级 Vue3 TSX 模式合集。

---

## 1. Composable（组合函数）

### 什么是 Composable？

Composable 是一个**使用 Vue Composition API** 来封装可复用逻辑的函数。它可以包含 `ref`、`reactive`、`computed`、`watch`、生命周期钩子以及任何 Vue 特性。

### Template 等价写法

在 Options API 中，相关逻辑分散在不同的选项中：

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

所有逻辑集中在一个函数中：

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

### 使用方式

```tsx
// 在任意组件中：
const todo = useTodos('my-todos')
todo.add('新任务')
console.log(todo.filteredList.value)
```

**Demo 文件**：`src/composables/useTodos.ts`

---

## 2. Transition / TransitionGroup（过渡动画）

### Transition — 单个元素

为进入或离开 DOM 的单个元素添加动画。

```vue
<!-- Template -->
<Transition name="fade">
  <div v-if="show">你好</div>
</Transition>
```

```tsx
// TSX — 条件放在 Transition 内部
<Transition name="fade">
  {show.value && <div>你好</div>}
</Transition>
```

### TransitionGroup — 列表动画

为多个元素的添加、删除或重新排序添加动画。

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

### CSS 类名规则

当设置 `name="todo"` 时，Vue 会自动添加以下 CSS 类：

| 类名 | 时机 | 作用 |
|-------|------|------|
| `.todo-enter-from` | 进入的第一帧 | `opacity: 0; transform: translateX(-24px)` |
| `.todo-enter-active` | 进入过程中 | `transition: all 0.35s ease` |
| `.todo-enter-to` | 最后一帧（可省略） | 默认为元素正常样式 |
| `.todo-leave-from` | 离开的第一帧（可省略） | 默认为元素正常样式 |
| `.todo-leave-active` | 离开过程中 | `transition: all 0.3s ease; position: absolute` |
| `.todo-leave-to` | 离开的最后一帧 | `opacity: 0; transform: translateX(24px)` |
| `.todo-move` | 兄弟元素移动时 | `transition: transform 0.3s ease` |

**重要提示**：在 `.todo-leave-active` 上设置 `position: absolute`，让离开的元素不占用空间，这样 `.todo-move` 才能流畅地让剩余元素向上移动。

**Demo 文件**：`src/App.tsx`（Todo 列表的 TransitionGroup，弹窗的 Transition）、`src/styles.css`（动画类）

---

## 3. Teleport

将内容渲染到不同的 DOM 位置，绕过父级 CSS 约束。

```vue
<!-- Template -->
<Teleport to="body">
  <div class="modal">弹窗内容</div>
</Teleport>
```

```tsx
// TSX — 语法完全相同！
<Teleport to="body">
  {props.visible && (
    <div class="modal">
      {slots.default?.()}
    </div>
  )}
</Teleport>
```

**为什么需要 Teleport**：弹窗需要脱离带有 `overflow: hidden` 或 `transform` 的父容器，这些 CSS 属性会裁剪或影响弹窗的定位。

**Demo 文件**：`src/components/TodoModal.tsx`

---

## 4. 条件渲染

```vue
<!-- Template -->
<div v-if="loading">加载中...</div>
<div v-else-if="error">错误：{{ error }}</div>
<div v-else>内容</div>
```

```tsx
// TSX — 使用三元或 && 链
{loading.value ? (
  <div>加载中...</div>
) : error.value ? (
  <div>错误：{error.value}</div>
) : (
  <div>内容</div>
)}
```

---

## 5. 列表渲染

```vue
<!-- Template -->
<li v-for="(item, index) in items" :key="item.id">
  {{ index }}: {{ item.name }}
</li>
```

```tsx
// TSX — .map() 带索引
{items.value.map((item, index) => (
  <li key={item.id}>
    {index}: {item.name}
  </li>
))}
```

始终为列表项提供**唯一的 `key`** prop，和 Template 中的规则一样。

---

## 6. 表单元素上的 `v-model`

```vue
<!-- Template -->
<input v-model="text" />
<textarea v-model="description" />
<select v-model="selected">
  <option value="a">A</option>
</select>
```

```tsx
// TSX — v-model 指令仍然可用！
<input v-model={text.value} />
<textarea v-model={description.value} />
<select v-model={selected.value}>
  <option value="a">A</option>
</select>
```

Vite 的 `@vitejs/plugin-vue-jsx` 支持在 JSX 语法中使用 `v-model` 指令。

---

## 快速参考

| 特性 | Template | TSX |
|---------|----------|-----|
| Composable | setup 中调用 `useX()` | 相同 |
| Transition | `<Transition name>` | `<Transition name>` |
| TransitionGroup | `<TransitionGroup>` | `<TransitionGroup>` |
| Teleport | `<Teleport to="body">` | `<Teleport to="body">` |
| 条件渲染 | `v-if / v-else` | `&& / 三元表达式` |
| 列表渲染 | `v-for="i in list"` | `{list.map(i => ...)}` |
| v-model（表单） | `v-model="x"` | `v-model={x.value}` |

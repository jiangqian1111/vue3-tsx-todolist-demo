# 第五章：组件通信 — Props 与 Emits

## 数据流向

```
父组件
   │
   ├── Props ──────────────►  子组件（数据向下）
   │
   └── ◄─── Emits（事件）      子组件（事件向上）
```

## Props — 父传子

### 定义 Props

```vue
<!-- Template：defineProps -->
<script setup lang="ts">
const props = defineProps({
  task: { type: String, required: true },
  done: { type: Boolean, default: false }
})
</script>
```

```tsx
// TSX：在 defineComponent 中声明 props
export default defineComponent({
  props: {
    task: { type: String, required: true },
    done: { type: Boolean, default: false }
  },
  setup(props) {
    // 访问方式：props.task、props.done
    return () => <div>{props.task}</div>
  }
})
```

### 传递 Props

```vue
<!-- Template -->
<TodoItem :task="item.task" :done="item.done" />
```

```tsx
// TSX — 单花括号，不需要冒号前缀
<TodoItem task={item.task} done={item.done} />
```

**规律**：`:prop="val"` → `prop={val}`（去掉冒号，用单花括号包裹）

## Emits — 子传父

### 定义和触发

```vue
<!-- Template -->
<script setup>
const emit = defineEmits(['toggle', 'del'])
</script>
<button @click="emit('toggle')">切换</button>
<div @click="$emit('del')">删除</div>
```

```tsx
// TSX
export default defineComponent({
  emits: ['toggle', 'del'],
  setup(props, { emit }) {
    return () => (
      <div>
        <button onClick={() => emit('toggle')}>切换</button>
        <button onClick={() => emit('del')}>删除</button>
      </div>
    )
  }
})
```

### 监听事件

```vue
<!-- Template -->
<TodoItem @toggle="handleToggle" @del="handleDel" />
```

```tsx
// TSX
<TodoItem onToggle={handleToggle} onDel={handleDel} />
```

**规律**：`@event="fn"` → `onEvent={fn}`

## `v-model` 模式

`v-model` 本质上就是 `:prop + @update:prop` 的语法糖：

```vue
<!-- Template 语法糖 -->
<TodoModal v-model:visible="isOpen" />

<!-- Template 展平后 -->
<TodoModal :visible="isOpen" @update:visible="val => isOpen = val" />
```

```tsx
// TSX — 自定义组件不支持 v-model 语法糖
<TodoModal
  visible={isOpen.value}
  onUpdate:visible={(val) => isOpen.value = val}
/>
```

在子组件中：

```vue
<!-- Template -->
<script setup>
const emit = defineEmits(['update:visible'])
</script>
<button @click="emit('update:visible', false)">关闭</button>
```

```tsx
// TSX
export default defineComponent({
  props: { visible: Boolean },
  emits: ['update:visible'],
  setup(props, { emit }) {
    return () => (
      <button onClick={() => emit('update:visible', false)}>
        关闭
      </button>
    )
  }
})
```

## Demo 中对应的文件

| 文件 | 展示内容 |
|------|---------|
| `src/components/TodoItem.tsx` | 定义 `props: { task, done }`，`emits: ['toggle', 'del']` |
| `src/App.tsx` | 传递 `task={item.task}`，监听 `onToggle={...}` |
| `src/components/TodoModal.tsx` | 完整的 v-model 模式：prop `visible` + emit `update:visible` |
| `src/components/TodoInput.tsx` | `emits: ['add']` — 子组件通知父组件新增任务 |

## 小结

| | Template | TSX |
|--|----------|-----|
| Props 定义 | `defineProps([...])` | `props: { ... }` |
| Props 访问 | `props.task` | `props.task`（完全相同！） |
| 传递 prop | `:task="val"` | `task={val}` |
| Emit 定义 | `defineEmits([...])` | `emits: [...]` |
| 触发事件 | `$emit('event')` | `emit('event')` |
| 监听事件 | `@event="fn"` | `onEvent={fn}` |
| v-model（元素） | `v-model="x"` | `v-model={x.value}` |
| v-model（组件） | `v-model:visible` | 手动写 `prop + onUpdate:prop` |

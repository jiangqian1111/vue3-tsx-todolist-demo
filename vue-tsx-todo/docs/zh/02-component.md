# 第二章：组件定义 — `defineComponent`

## Template 方式

在 `.vue` 文件中，使用 `<script setup>` 或 Options API 来定义组件：

```vue
<!-- 方式一：<script setup>（Vue3 推荐） -->
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
<template>
  <button @click="count++">{{ count }}</button>
</template>

<!-- 方式二：Options API -->
<script lang="ts">
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
</script>
```

## TSX 方式

在 `.tsx` 文件中，使用 `defineComponent`：

```tsx
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CounterButton',

  setup() {
    const count = ref(0)

    // 返回一个渲染函数
    return () => (
      <button onClick={() => count.value++}>
        {count.value}
      </button>
    )
  }
})
```

## 为什么需要 `defineComponent`？

1. **TypeScript 类型推断** — Vue 可以推断 props、emit 等的类型
2. **统一的 API** — 兼容 Options API 和 Composition API
3. **编译器提示** — 告诉 Vite/Vue 这是一个组件，而不是普通对象

## TSX 组件结构剖析

```tsx
export default defineComponent({
  // 1. 组件名称（在 DevTools 中显示）
  name: 'MyComponent',

  // 2. Props 定义
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 }
  },

  // 3. 声明要触发的事件
  emits: ['update', 'delete'],

  // 4. setup 函数 —— 组件创建时执行一次
  setup(props, { emit, slots, expose, attrs }) {
    // 响应式状态
    const localCount = ref(0)

    // 方法
    const handleClick = () => {
      emit('update', localCount.value)
    }

    // 生命周期
    onMounted(() => {
      console.log('组件已挂载！')
    })

    // 渲染函数
    return () => (
      <div onClick={handleClick}>
        {props.title}: {props.count}
      </div>
    )
  }
})
```

## 常见错误

### 忘记返回函数

```tsx
// ❌ 错误：直接返回 JSX
setup() {
  return <div>hello</div>
}

// ✅ 正确：返回一个函数 () => JSX
setup() {
  return () => <div>hello</div>
}
```

### 忘记 props 是响应式的但访问方式不同

```tsx
setup(props) {
  // props 是响应式的——父组件重新渲染时它会更新
  // 但访问方式是 props.title（不是 props.title.value）
  return () => <div>{props.title}</div>
}
```

## Demo 中对应的文件

| 文件 | 展示内容 |
|------|---------|
| `src/App.tsx` | 根组件，setup() 返回整个页面的渲染函数 |
| `src/components/TodoInput.tsx` | 包含 props、emits、expose、生命周期的组件 |
| `src/components/TodoItem.tsx` | 包含 props、emits、slots、inject 的组件 |
| `src/components/TodoModal.tsx` | 使用 Teleport、v-model 模式的组件 |

## 小结

- **Template**：`<script setup>` 或 `export default { ... }`
- **TSX**：`defineComponent({ setup() { return () => JSX } })`
- `defineComponent` 只是 TypeScript 的类型包装——运行时它就是一个普通对象
- `setup()` 返回的是**渲染函数**（不是直接的 JSX）

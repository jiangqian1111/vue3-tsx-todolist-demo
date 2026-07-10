# 第八章：Expose 与模板引用

## 两种 Ref

在 Vue 中，`ref` 有两个不同的用途：

1. **DOM ref**：绑定到 HTML 元素 → 获取 DOM 节点
2. **组件 ref**：绑定到子组件 → 获取组件实例

两种使用相同的语法，但返回的东西不同。

## DOM Ref

获取对真实 DOM 元素的引用：

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
  const inputEl = ref<HTMLInputElement>()  // 类型：HTMLInputElement | undefined

  onMounted(() => {
    inputEl.value?.focus()
  })

  return () => <input ref={inputEl} />
}
```

## 组件 Ref

获取对子组件实例的引用：

```vue
<!-- Template -->
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'
const childRef = ref(null)
</script>
<template>
  <Child ref="childRef" />
  <button @click="childRef.someMethod()">调用</button>
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
        调用
      </button>
    </div>
  )
}
```

## `expose()` 函数

默认情况下，组件实例会暴露 **setup 中返回的所有**变量。这意味着父组件可以访问内部状态：

```tsx
// 子组件 — 没有 expose()
setup() {
  const secret = ref('hidden')
  const visible = () => console.log('hello')

  return { secret, visible }
}

// 父组件 — 什么都能看到！
childRef.value.secret  // 'hidden' — 内部状态暴露了！
childRef.value.visible // () => console.log('hello')
```

`expose()` 让你**控制**哪些内容对外可见：

```tsx
// 子组件 — 使用 expose()
setup(props, { expose }) {
  const secret = ref('hidden')      // 私有
  const visible = () => console.log('hello')  // 公开

  expose({ visible })
  // secret 没有被暴露！
}

// 父组件 — 只能看到暴露出来的内容
childRef.value.secret  // undefined！
childRef.value.visible // ✅ 正常工作
```

## 配合 TypeScript 类型安全

要获得完整的 TypeScript 支持，导出与暴露方法匹配的接口：

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

// TypeScript 知道这些方法存在：
inputComp.value?.focus()  // ✅ TypeScript 认可
inputComp.value?.clear()  // ✅ TypeScript 认可
inputComp.value?.text     // ❌ TypeScript 报错 — 不在接口中
```

## Demo 中对应的文件

| 文件 | 展示内容 |
|------|---------|
| `src/components/TodoInput.tsx` | 导出 `TodoInputExposed` 接口，调用 `expose({ focus, clear })` |
| `src/App.tsx` | `ref<TodoInputExposed>()`，绑定 `<TodoInput ref={inputComp} />`，调用 `inputComp.value?.focus()` 和 `inputComp.value?.clear()` |

## 小结

| | Template | TSX |
|--|----------|-----|
| DOM ref | `ref="el"` | `ref={el}`（传对象） |
| 组件 ref | `ref="comp"` | `ref={comp}`（传对象） |
| 暴露方法 | `defineExpose({...})` | `expose({...})` |
| 类型安全 | 手动 | 接口 + ref\<接口类型\> |

**最佳实践**：始终只 `expose()` 必要的方法，并始终导出匹配的 TypeScript 接口。

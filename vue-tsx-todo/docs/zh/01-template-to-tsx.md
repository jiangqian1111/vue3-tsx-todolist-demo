# 第一章：从 Vue Template 到 TSX

## 为什么要用 TSX？

Vue 的 `<template>` 在构建时会被**编译**成渲染函数（render function）。TSX（或 JSX）让你可以**直接**编写渲染函数——跳过编译步骤，拥有 JavaScript 的全部表达能力。

```
Vue Template (.vue)       →  Vue 编译器  →  渲染函数  →  虚拟 DOM  →  真实 DOM
TSX (.tsx)                →  跳过        →  渲染函数  →  虚拟 DOM  →  真实 DOM
```

## Template 与 TSX：逐一对比

### 文本插值

```vue
<!-- Template -->
<template>
  <div>{{ message }}</div>
</template>
<script setup>
const message = ref('Hello')
</script>
```

```tsx
// TSX
export default defineComponent({
  setup() {
    const message = ref('Hello')
    return () => <div>{message.value}</div>
    //              ↑    ↑
    //         不需要 {{ }}  需要 .value！
  }
})
```

**关键点**：Template 会自动解包 ref（`{{ message }}`）。在 TSX 中，你必须手动写 `{message.value}`。

### 条件渲染

```vue
<!-- Template: v-if -->
<div v-if="show">可见</div>
<div v-else>隐藏</div>
```

```tsx
// TSX：使用 JavaScript 的 && 运算符
{show.value && <div>可见</div>}
{!show.value && <div>隐藏</div>}

// 或者用三元表达式：
{show.value ? <div>可见</div> : <div>隐藏</div>}
```

### 列表渲染

```vue
<!-- Template: v-for -->
<li v-for="item in list" :key="item.id">
  {{ item.task }}
</li>
```

```tsx
// TSX：使用 .map()
{list.map(item => (
  <li key={item.id}>{item.task}</li>
))}
```

### 事件绑定

```vue
<!-- Template -->
<button @click="handleAdd">添加</button>
<input @keyup.enter="handleAdd" />
```

```tsx
// TSX
<button onClick={handleAdd}>添加</button>
<input onKeyup={(e) => e.key === 'Enter' && handleAdd()} />
```

### 属性绑定

```vue
<!-- Template -->
<div :class="{ active: isActive }">你好</div>
<img :src="imageUrl" />
```

```tsx
// TSX
<div class={isActive.value ? 'active' : ''}>你好</div>
<img src={imageUrl.value} />
```

## 快速对照表

| 功能 | Template | TSX |
|---------|----------|-----|
| 文本 | `{{ msg }}` | `{msg.value}` |
| 条件 | `v-if="ok"` | `{ok.value && <X/>}` |
| 循环 | `v-for="i in list"` | `{list.map(i => ...)}` |
| 点击 | `@click="fn"` | `onClick={fn}` |
| 按键 | `@keyup.enter="fn"` | `onKeyup={e => e.key==='Enter' && fn()}` |
| 类名 | `:class="cls"` | `class={cls.value}` |
| 样式 | `:style="sty"` | `style={sty}` |
| 双向绑定 | `v-model="x"` | `v-model={x.value}` |
| 模板引用 | `ref="x"` | `ref={x}`（传对象） |
| 插槽 | `<slot />` | `{slots.default?.()}` |

## 在 Demo 中的位置

每一个 `src/` 目录下的 `.tsx` 文件都展示了这种转换。建议从以下文件开始阅读：
- `src/App.tsx` — 主页面，展示条件渲染、列表、事件
- `src/components/TodoInput.tsx` — 展示 v-model、事件、ref

## 练习

打开 `src/App.tsx`，找出**至少 3 个**上表中没有列出的 Template → TSX 转换示例。

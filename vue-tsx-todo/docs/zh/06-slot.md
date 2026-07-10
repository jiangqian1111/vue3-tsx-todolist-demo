# 第六章：插槽（Slots）

## 什么是插槽？

插槽是 Vue 的**内容投射**机制——允许父组件向子组件的模板中注入内容。

可以把插槽理解为子组件中的占位符，由父组件来填充。

## 默认插槽

```vue
<!-- Template 子组件：定义一个插槽 -->
<template>
  <div class="card">
    <slot />  <!-- ← 父组件传递的内容出现在这里 -->
  </div>
</template>

<!-- Template 父组件：传递内容 -->
<Card>
  <p>这些内容会被放入插槽！</p>
</Card>
```

```tsx
// TSX 子组件
setup(props, { slots }) {
  return () => (
    <div class="card">
      {slots.default?.()}
    </div>
  )
}

// TSX 父组件
<Card v-slots={{
  default: () => <p>这些内容会被放入插槽！</p>
}} />
```

## 具名插槽

```vue
<!-- Template 子组件 -->
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>
</template>

<!-- Template 父组件 -->
<Child>
  <template v-slot:header>
    <h1>标题</h1>
  </template>
  <p>默认内容</p>
</Child>
```

```tsx
// TSX 子组件
setup(props, { slots }) {
  return () => (
    <div>
      <header>{slots.header?.()}</header>
      <main>{slots.default?.()}</main>
    </div>
  )
}

// TSX 父组件 — 使用 v-slots 指令
<Child v-slots={{
  header: () => <h1>标题</h1>,
  default: () => <p>默认内容</p>
}} />
```

## 作用域插槽（向父组件传递数据）

```vue
<!-- Template 子组件：把数据传回父组件 -->
<template>
  <slot :status="status" :count="count" />
</template>

<!-- Template 父组件：接收数据 -->
<Child v-slot="{ status, count }">
  <span>{{ status }} — {{ count }}</span>
</Child>
```

```tsx
// TSX 子组件 — 将对象传给 slot 函数
setup(props, { slots }) {
  const status = '已完成'
  const count = 5
  return () => (
    <div>
      {slots.default?.({ status, count })}
    </div>
  )
}

// TSX 父组件 — 在箭头函数中接收
<Child v-slots={{
  default: (scope: { status: string; count: number }) => (
    <span>{scope.status} — {scope.count}</span>
  )
}} />
```

## 为什么 TSX 中要用 `v-slots`？

`v-slots` 是一个 **Vue JSX 指令**——它是 `v-slot` 模板指令的 TSX 等价物。没有它，就没有原生的 JSX 语法来向组件传递多个 slot 函数。

## 可选链很重要

调用 slot 时始终使用 `?.()`：

```tsx
// ✅ 安全：如果 slot 没有被提供，也不会崩溃
{slots.default?.()}
{slots.header?.()}

// ❌ 不安全：如果 slot 没有被提供，会崩溃
{slots.default()}
```

## Demo 中对应的文件

| 文件 | 展示内容 |
|------|---------|
| `src/components/TodoItem.tsx` | 定义 `slots.header?.()` 和 `slots.default?.({ status })` |
| `src/App.tsx` | 传递 `v-slots={{ header: () => ..., default: (scope) => ... }}` |
| `src/components/TodoModal.tsx` | 使用 `{slots.default?.()}` 渲染弹窗内容 |

## 小结

| | Template | TSX |
|--|----------|-----|
| 默认插槽 | `<slot />` | `{slots.default?.()}` |
| 具名插槽 | `<slot name="header" />` | `{slots.header?.()}` |
| 作用域插槽 | `<slot :x="x">` | `{slots.default?.({ x })}` |
| 传递默认内容 | 写在标签内部 | `v-slots={{ default: () => ... }}` |
| 传递具名内容 | `<template v-slot:header>` | `v-slots={{ header: () => ... }}` |
| 接收作用域数据 | `v-slot="{ x }"` | `(scope) => ...` |

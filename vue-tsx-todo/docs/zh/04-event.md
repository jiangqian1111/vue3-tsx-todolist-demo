# 第四章：事件处理

## 事件映射规则

从 Template 到 TSX，事件绑定语法是最直观的变化之一：

| Template | TSX |
|----------|-----|
| `@click` | `onClick` |
| `@change` | `onChange` |
| `@keyup` | `onKeyup` |
| `@keydown` | `onKeydown` |
| `@submit` | `onSubmit` |
| `@mouseenter` | `onMouseenter` |

规律：**去掉 `@`，首字母大写，前面加 `on`。**

## 简单示例

```vue
<!-- Template -->
<button @click="handleClick">点击</button>
```

```tsx
// TSX
<button onClick={handleClick}>点击</button>
```

## 传递参数

```vue
<!-- Template -->
<button @click="handleClick(item.id)">删除</button>
```

```tsx
// TSX — 使用箭头函数
<button onClick={() => handleClick(item.id)}>删除</button>
```

## 事件修饰符

Template 有便捷的事件修饰符，比如 `.enter`、`.prevent`、`.stop`：

```vue
<!-- Template — 内置修饰符 -->
<input @keyup.enter="submit" />
<form @submit.prevent="onSubmit" />
<div @click.stop="handleClick" />
```

在 TSX 中，修饰符不存在——你需要手动实现：

```tsx
// TSX — 手动判断
<input onKeyup={(e) => {
  if (e.key === 'Enter') submit()
}} />

<form onSubmit={(e) => {
  e.preventDefault()
  onSubmit()
}} />

<div onClick={(e) => {
  e.stopPropagation()
  handleClick()
}} />
```

## 为什么没有修饰符？

Template 修饰符是**编译器特性**——Vue 模板编译器会把 `@keyup.enter` 转换为带按键检查的 `onKeyup`。因为 TSX 绕过了模板编译器，所以修饰符不可用。

## 原生事件对象

在 TSX 中，事件处理函数直接接收**原生 DOM 事件**：

```tsx
const handleKeyup = (e: KeyboardEvent) => {
  console.log(e.key)        // "Enter"、"Escape" 等
  console.log(e.target)     // 触发事件的元素
  console.log(e.ctrlKey)    // 如果按住 Ctrl 键则为 true
}
```

## Demo 中的事件绑定

```tsx
// src/components/TodoInput.tsx
<input
  v-model={text.value}
  onKeyup={handleKeyup}       // 监听按键事件
/>
<button onClick={handleAdd}>  // 监听点击
  添加
</button>

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {   // 手动修饰符检查
    handleAdd()
  }
}
```

```tsx
// src/components/TodoItem.tsx
<div onClick={() => emit('toggle')}>   // 向父组件发送事件
  ...
</div>
```

```tsx
// src/components/TodoModal.tsx
<div class="modal-mask" onClick={() => emit('update:visible', false)}>
  <div class="modal-content" onClick={(e) => e.stopPropagation()}>
    {/* ... */}
  </div>
</div>
```

## 小结

| | Template | TSX |
|--|----------|-----|
| 语法 | `@click="fn"` | `onClick={fn}` |
| 传参 | `@click="fn(arg)"` | `onClick={() => fn(arg)}` |
| 修饰符 | `@keyup.enter` | 手动判断 `e.key === 'Enter'` |
| 事件对象 | `$event` | `e`（第一个参数） |
| 阻止默认 | `@submit.prevent` | `e.preventDefault()` |
| 阻止冒泡 | `@click.stop` | `e.stopPropagation()` |

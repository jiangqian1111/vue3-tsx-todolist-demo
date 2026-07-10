# Chapter 4: Event Handling

## The Mapping

The biggest visual change from Template to TSX is event binding syntax:

| Template | TSX |
|----------|-----|
| `@click` | `onClick` |
| `@change` | `onChange` |
| `@keyup` | `onKeyup` |
| `@keydown` | `onKeydown` |
| `@submit` | `onSubmit` |
| `@mouseenter` | `onMouseenter` |

Pattern: **remove `@`, capitalize first letter, prefix with `on`.**

## Simple Example

```vue
<!-- Template -->
<button @click="handleClick">Click</button>
```

```tsx
// TSX
<button onClick={handleClick}>Click</button>
```

## Passing Arguments

```vue
<!-- Template -->
<button @click="handleClick(item.id)">Delete</button>
```

```tsx
// TSX — use arrow function
<button onClick={() => handleClick(item.id)}>Delete</button>
```

## Event Modifiers

Template has convenient event modifiers like `.enter`, `.prevent`, `.stop`:

```vue
<!-- Template — built-in modifiers -->
<input @keyup.enter="submit" />
<form @submit.prevent="onSubmit" />
<div @click.stop="handleClick" />
```

In TSX, modifiers don't exist — you implement them manually:

```tsx
// TSX — manual check
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

## Why No Modifiers?

Template modifiers are a **compiler feature** — the Vue template compiler transforms `@keyup.enter` into `onKeyup` with a key check. Since TSX bypasses the template compiler, modifiers are not available.

## Native Event Object

In TSX, the event handler receives the **native DOM event** directly:

```tsx
const handleKeyup = (e: KeyboardEvent) => {
  console.log(e.key)        // "Enter", "Escape", etc.
  console.log(e.target)     // The element that fired the event
  console.log(e.ctrlKey)    // true if Ctrl held
}
```

## Event Binding in the Demo

```tsx
// src/components/TodoInput.tsx
<input
  v-model={text.value}
  onKeyup={handleKeyup}       // Listen for key events
/>
<button onClick={handleAdd}>  // Listen for click
  Add
</button>

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {   // Manual modifier check
    handleAdd()
  }
}
```

```tsx
// src/components/TodoItem.tsx
<div onClick={() => emit('toggle')}>   // Emit event to parent
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

## Summary

| | Template | TSX |
|--|----------|-----|
| Syntax | `@click="fn"` | `onClick={fn}` |
| Arguments | `@click="fn(arg)"` | `onClick={() => fn(arg)}` |
| Modifiers | `@keyup.enter` | Manual `e.key === 'Enter'` |
| Event obj | `$event` | `e` (first param) |
| Prevent | `@submit.prevent` | `e.preventDefault()` |
| Stop | `@click.stop` | `e.stopPropagation()` |

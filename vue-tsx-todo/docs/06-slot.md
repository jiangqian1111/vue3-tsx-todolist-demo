# Chapter 6: Slots

## What Are Slots?

Slots are Vue's mechanism for **content projection** — allowing a parent component to inject content into a child component's template.

Think of it as a placeholder in the child that gets filled by the parent.

## Default Slot

```vue
<!-- Template Child: defines a slot -->
<template>
  <div class="card">
    <slot />  <!-- ← Content from parent appears here -->
  </div>
</template>

<!-- Template Parent: passes content -->
<Card>
  <p>This goes into the slot!</p>
</Card>
```

```tsx
// TSX Child
setup(props, { slots }) {
  return () => (
    <div class="card">
      {slots.default?.()}
    </div>
  )
}

// TSX Parent
<Card v-slots={{
  default: () => <p>This goes into the slot!</p>
}} />
```

## Named Slots

```vue
<!-- Template Child -->
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>
</template>

<!-- Template Parent -->
<Child>
  <template v-slot:header>
    <h1>Title</h1>
  </template>
  <p>Default content</p>
</Child>
```

```tsx
// TSX Child
setup(props, { slots }) {
  return () => (
    <div>
      <header>{slots.header?.()}</header>
      <main>{slots.default?.()}</main>
    </div>
  )
}

// TSX Parent — uses v-slots directive
<Child v-slots={{
  header: () => <h1>Title</h1>,
  default: () => <p>Default content</p>
}} />
```

## Scoped Slots (Passing Data to Parent)

```vue
<!-- Template Child: passes data back to parent -->
<template>
  <slot :status="status" :count="count" />
</template>

<!-- Template Parent: receives data -->
<Child v-slot="{ status, count }">
  <span>{{ status }} — {{ count }}</span>
</Child>
```

```tsx
// TSX Child — pass object to slot function
setup(props, { slots }) {
  const status = 'completed'
  const count = 5
  return () => (
    <div>
      {slots.default?.({ status, count })}
    </div>
  )
}

// TSX Parent — receive in arrow function
<Child v-slots={{
  default: (scope: { status: string; count: number }) => (
    <span>{scope.status} — {scope.count}</span>
  )
}} />
```

## Why `v-slots` in TSX?

`v-slots` is a **Vue JSX directive** — it's the TSX equivalent of the `v-slot` template directive. Without it, there's no native JSX syntax for passing multiple slot functions to a component.

## Optional Chaining is Important

Always use `?.()` when calling slots:

```tsx
// ✅ Safe: won't crash if slot wasn't provided
{slots.default?.()}
{slots.header?.()}

// ❌ Unsafe: crashes if slot wasn't provided
{slots.default()}
```

## Demo Location

| File | What it shows |
|------|---------------|
| `src/components/TodoItem.tsx` | Defines `slots.header?.()` and `slots.default?.({ status })` |
| `src/App.tsx` | Passes `v-slots={{ header: () => ..., default: (scope) => ... }}` |
| `src/components/TodoModal.tsx` | Uses `{slots.default?.()}` for modal body content |

## Summary

| | Template | TSX |
|--|----------|-----|
| Default slot | `<slot />` | `{slots.default?.()}` |
| Named slot | `<slot name="header" />` | `{slots.header?.()}` |
| Scoped slot | `<slot :x="x">` | `{slots.default?.({ x })}` |
| Pass default | Inside tags | `v-slots={{ default: () => ... }}` |
| Pass named | `<template v-slot:header>` | `v-slots={{ header: () => ... }}` |
| Receive scope | `v-slot="{ x }"` | `(scope) => ...` |

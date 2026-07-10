# Chapter 7: Provide / Inject

## The Problem

Data flows **top-down** through props. When a deeply nested component needs data from a far ancestor, you end up passing props through every intermediate component — this is called **prop drilling**.

```
App (theme: 'blue')
  └── Page
       └── TodoItem (needs theme!)
            └── Button
```

Without provide/inject, you'd pass `theme` through `Page` → `TodoItem` → `Button`, even though `Page` and `Button` don't need it.

## The Solution

`provide` lets an ancestor supply data to **any** descendant, regardless of depth.

```
App (provide: theme → 'blue')
  └── Page (doesn't need theme)
       └── TodoItem (inject: theme → 'blue')
            └── Button (doesn't need theme)
```

## Basic Usage

### Template

```vue
<!-- Ancestor: provides the value -->
<script setup>
import { ref, provide } from 'vue'
const theme = ref('blue')
provide('theme', theme)
</script>

<!-- Descendant: injects the value -->
<script setup>
import { inject } from 'vue'
const theme = inject('theme', ref('blue')) // default value
</script>
<template>
  <div :style="{ color: theme }">Colored text</div>
</template>
```

### TSX

```tsx
// Ancestor
setup() {
  const theme = ref('blue')
  provide('theme', theme)
  return () => <Child />
}

// Descendant
setup() {
  const theme = inject('theme', ref('blue'))
  return () => <div style={{ color: theme.value }}>Colored text</div>
}
```

## The Problem with String Keys

```tsx
// Provider
provide('theme-color', ref('blue'))

// Injector — typo!
const color = inject('theme-colour')  // undefined! No error!

// Another provider — accidental collision!
provide('theme-color', ref('red'))  // Overwrites the first one silently
```

String keys are error-prone. There's no type checking, no collision prevention.

## Solution: `InjectionKey` + `Symbol`

```tsx
import { type InjectionKey, type Ref } from 'vue'

// 1. Create a Symbol with type information
export const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme')

// 2. Provide — TypeScript checks that the value matches Ref<string>
provide(ThemeKey, ref('blue'))

// 3. Inject — TypeScript knows the return type is Ref<string> | undefined
const theme = inject(ThemeKey)!
// theme.value is typed as string ✅
```

**Why this is better:**
- `Symbol('theme')` is **unique** — no two symbols are equal, so no collisions
- `InjectionKey<Ref<string>>` tells TypeScript the type — no need for type assertions
- The provider and injector MUST use the same Symbol — they can't accidentally mismatch

## Provider Functions Pattern

A common pattern is to wrap `provide()` in a function:

```tsx
// options.ts
export const provideOptions = () => {
  const options = ref<Options>({ theme: 'blue', showDate: true })
  provide(OptionsKey, options)
  return options  // Return so the caller can also modify it
}

export const useOptions = () => {
  return inject(OptionsKey)!  // Non-null assertion: caller must use after provide
}
```

This gives you:
1. Single import in both provider and injector
2. Type-safe return values
3. Encapsulation of the Symbol key

## Demo Location

| File | What it shows |
|------|---------------|
| `src/options.ts` | Defines `FooterKey` and `OptionsKey` as `InjectionKey`, exports provider/injector functions |
| `src/App.tsx` | Calls `provideOptions()` and `provideFooter()` in setup |
| `src/components/TodoItem.tsx` | Calls `useOptions()` to inject theme color |
| `src/components/TodoFooter.tsx` | Calls `inject(FooterKey)` to get footer text |

## Summary

| | Template | TSX |
|--|----------|-----|
| Provide | `provide('key', val)` | Same API |
| Inject | `inject('key')` | Same API |
| Type safety | None (string) | `InjectionKey<Type> + Symbol` |
| Best practice | — | Provider function pattern |

**Rule of thumb**: Always use `InjectionKey` + `Symbol`. Never use string keys in a real project.

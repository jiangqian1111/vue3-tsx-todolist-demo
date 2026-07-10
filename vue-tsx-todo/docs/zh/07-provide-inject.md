# 第七章：Provide / Inject

## 要解决的问题

数据通过 props 从顶层向下流转。当深层嵌套的组件需要从遥远的祖先获取数据时，你不得不通过每一个中间组件传递 props——这被称为 **prop 逐层透传（prop drilling）**。

```
App（theme: 'blue'）
  └── Page
       └── TodoItem（需要 theme！）
            └── Button
```

没有 provide/inject 的情况下，你必须通过 `Page` → `TodoItem` → `Button` 逐层传递 `theme`，即使 `Page` 和 `Button` 根本不需要它。

## 解决方案

`provide` 让祖先可以向**任意**后代提供数据，无论嵌套多深。

```
App（provide: theme → 'blue'）
  └── Page（不需要 theme）
       └── TodoItem（inject: theme → 'blue'）
            └── Button（不需要 theme）
```

## 基本用法

### Template

```vue
<!-- 祖先组件：提供值 -->
<script setup>
import { ref, provide } from 'vue'
const theme = ref('blue')
provide('theme', theme)
</script>

<!-- 后代组件：注入值 -->
<script setup>
import { inject } from 'vue'
const theme = inject('theme', ref('blue')) // 默认值
</script>
<template>
  <div :style="{ color: theme }">有颜色的文字</div>
</template>
```

### TSX

```tsx
// 祖先组件
setup() {
  const theme = ref('blue')
  provide('theme', theme)
  return () => <Child />
}

// 后代组件
setup() {
  const theme = inject('theme', ref('blue'))
  return () => <div style={{ color: theme.value }}>有颜色的文字</div>
}
```

## 字符串 Key 的问题

```tsx
// 提供方
provide('theme-color', ref('blue'))

// 注入方 — 拼写错误！
const color = inject('theme-colour')  // undefined！无报错！

// 另一个提供方 — 意外冲突！
provide('theme-color', ref('red'))  // 静默覆盖前一个
```

字符串 key 容易出错：没有类型检查，也无法防止冲突。

## 解决方案：`InjectionKey` + `Symbol`

```tsx
import { type InjectionKey, type Ref } from 'vue'

// 1. 创建带类型信息的 Symbol
export const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme')

// 2. Provide — TypeScript 检查值的类型是否匹配 Ref<string>
provide(ThemeKey, ref('blue'))

// 3. Inject — TypeScript 知道返回类型是 Ref<string> | undefined
const theme = inject(ThemeKey)!
// theme.value 的类型是 string ✅
```

**为什么这样做更好：**
- `Symbol('theme')` 是**唯一的**——没有两个 Symbol 会相等，所以不会有冲突
- `InjectionKey<Ref<string>>` 告诉 TypeScript 类型——不需要类型断言
- 提供方和注入方必须使用同一个 Symbol——不可能因为拼写错误而不匹配

## Provider 函数模式

一种常见的模式是将 `provide()` 封装在函数中：

```tsx
// options.ts
export const provideOptions = () => {
  const options = ref<Options>({ theme: 'blue', showDate: true })
  provide(OptionsKey, options)
  return options  // 返回以便调用方也能修改
}

export const useOptions = () => {
  return inject(OptionsKey)!  // 非空断言：调用方必须在 provide 后使用
}
```

这样做的好处：
1. 提供方和注入方只需一次导入
2. 返回类型安全
3. 封装了 Symbol key

## Demo 中对应的文件

| 文件 | 展示内容 |
|------|---------|
| `src/options.ts` | 定义 `FooterKey` 和 `OptionsKey` 作为 `InjectionKey`，导出 provider/injector 函数 |
| `src/App.tsx` | 在 setup 中调用 `provideOptions()` 和 `provideFooter()` |
| `src/components/TodoItem.tsx` | 调用 `useOptions()` 注入主题颜色 |
| `src/components/TodoFooter.tsx` | 调用 `inject(FooterKey)` 获取底部文字 |

## 小结

| | Template | TSX |
|--|----------|-----|
| Provide | `provide('key', val)` | API 相同 |
| Inject | `inject('key')` | API 相同 |
| 类型安全 | 无（字符串） | `InjectionKey<Type> + Symbol` |
| 最佳实践 | — | Provider 函数模式 |

**经验法则**：永远使用 `InjectionKey` + `Symbol`。在实际项目中绝对不要使用字符串 key。

# 第三章：响应式 — `ref`、`reactive`、`computed`

## 核心概念

Vue 3 的响应式系统用 **Proxy** 对象包裹数据。当你读取或写入数据时，Vue 可以追踪依赖并自动触发重新渲染。

## `ref` — 包装基本类型

```vue
<!-- Template -->
<script setup>
const count = ref(0)
const name = ref('Vue')
</script>
<template>
  <p>{{ count }} — {{ name }}</p>
  <!-- 自动解包：Vue 知道这是 ref，自动帮你提取 .value -->
</template>
```

```tsx
// TSX
const count = ref(0)
const name = ref('Vue')

// 在渲染函数中：
return () => (
  <p>{count.value} — {name.value}</p>
  //  ↑ 必须手动写 .value！
)
```

**这是 Template 开发者转向 TSX 时最容易遇到的坑。** Template 自动解包 ref；TSX 不会。

## `reactive` — 包装对象

```ts
const state = reactive({
  count: 0,
  name: 'Vue'
})
```

```vue
<!-- Template -->
<template>
  <p>{{ state.count }} — {{ state.name }}</p>
  <!-- reactive 对象不会自动解包，直接访问属性 -->
</template>
```

```tsx
// TSX — 这里和 Template 一样！
return () => (
  <p>{state.count} — {state.name}</p>
)
```

`reactive` 在 Template 和 TSX 中**都不需要** `.value`，因为对象本身就是代理。

## `computed` — 派生状态

```ts
const count = ref(2)
const doubled = computed(() => count.value * 2)
```

```vue
<!-- Template -->
<template>
  <p>{{ doubled }}</p>
  <!-- 自动解包！ -->
</template>
```

```tsx
// TSX — 需要 .value！
return () => <p>{doubled.value}</p>
```

`computed()` 返回的是 `ComputedRef`，它是一种特殊的 ref——在 TSX 中也需要 `.value`。

## 解包规则速查表

| API | Template | TSX |
|-----|----------|-----|
| `ref(0)` | `{{ count }}` | `{count.value}` |
| `reactive({ x: 1 })` | `{{ state.x }}` | `{state.x}` |
| `computed(() => x)` | `{{ doubled }}` | `{doubled.value}` |
| ref 在 reactive 内部 | 自动解包 | 自动解包 |
| `ref([])` | `{{ list[0] }}` | `{list.value[0]}` |

## 为什么会有这种差异？

Vue 的**模板编译器**增加了一个特殊步骤：检测到 `{{ count }}` 时会自动插入 `.value` 访问。这只在 `.vue` 文件中有效，因为编译器可以在构建时分析模板。

在 `.tsx` 文件中，没有模板编译器——JSX 由标准 JSX 转换器（如 `@vitejs/plugin-vue-jsx`）处理，它们不会做 ref 解包。因此需要手动 `.value`。

## ref 放在 reactive 里：例外情况

当一个 ref 被存储在 reactive 对象中时，它**会被**自动解包：

```ts
const count = ref(0)
const state = reactive({ count })

console.log(state.count) // 0 — 无需 .value！
state.count = 1          // 直接赋值！
console.log(count.value) // 1 — 原始 ref 也被更新了
```

这在 Template 和 TSX 中行为一致。

## Demo 中对应的文件

| 文件 | 展示内容 |
|------|---------|
| `src/composables/useTodos.ts` | 列表用 `reactive([])`，筛选用 `ref('all')`，统计用 `computed` |
| `src/components/TodoInput.tsx` | 输入文本用 `ref('')`，DOM ref 用 `ref<HTMLInputElement>()` |
| `src/App.tsx` | 弹窗状态用 `ref(false)` |

## 练习

查看 `src/composables/useTodos.ts`，找出以下内容：
1. 哪些变量是 `ref`，哪些是 `reactive`？
2. 为什么 `list` 用 `reactive` 而不是 `ref`？
3. 找出所有 `.value` 的使用——哪些在 Template 中会被省略？

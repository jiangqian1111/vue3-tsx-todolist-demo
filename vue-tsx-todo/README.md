# 🧩 Vue3 + TSX TodoList — Learning Demo

> **从 Vue3 Template 到 TSX 的渐进式学习项目**

![Vue3](https://img.shields.io/badge/Vue-3.5-4fc08d?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-blue)

<p align="center">
  <i>一个看似 TodoList，实则是 Vue3 TSX 学习教程集合的开源项目。</i>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-learning-path">Learning Path</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-docs">Docs</a>
</p>

---

## ✨ Features

| # | Topic | Status |
|---|-------|--------|
| 1 | `defineComponent` + Render Function | ✅ |
| 2 | `ref` / `reactive` / `computed` | ✅ |
| 3 | Props & Emits | ✅ |
| 4 | Slots (default, named, scoped) | ✅ |
| 5 | `provide` / `inject` with `InjectionKey` | ✅ |
| 6 | `expose` + Component Template Refs | ✅ |
| 7 | `Transition` / `TransitionGroup` Animations | ✅ |
| 8 | `Teleport` | ✅ |
| 9 | Composables (logic reuse) | ✅ |
| 10 | `watch` + `localStorage` Persistence | ✅ |
| 11 | Lifecycle Hooks | ✅ |
| 12 | Event Handling (onClick, onKeyup, etc.) | ✅ |
| 13 | Conditionals & List Rendering | ✅ |
| 14 | TypeScript Type Safety (no `any`) | ✅ |

Each feature is annotated **in-code** with `// template:` vs `// TSX:` comments, so you learn by reading real code.

---

## 🛠 Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Composition API + Reactivity System |
| **TypeScript** | Full type safety, no `any` |
| **TSX / JSX** | Render functions instead of templates |
| **Vite** | Fast HMR, ESM-native bundler |
| **CSS** | Pure CSS (no framework — easy to understand) |

</div>

---

## 🧭 Learning Path

```
┌─────────────────────────────────────────────────────────────┐
│                    Learning Roadmap                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Vue Template     Composition API         TSX Basics        │
│  ───────────      ────────────────        ──────────        │
│  • .vue files     • setup() hook         • defineComponent  │
│  • {{ mustache }} • ref / reactive       • .value unwrapping│
│  • @click         • computed/watch       • onClick={fn}     │
│  • v-if / v-for   • composables          • {list.map()}     │
│  • :prop="val"    • onMounted            • {cond && <X/>}   │
│                                                             │
│         ▼                    ▼                    ▼          │
│                                                             │
│  Component Communication          Advanced Capabilities     │
│  ───────────────────────          ─────────────────────     │
│  • Props + Emits                 • Transition/TransitionGroup│
│  • Slots (named/scoped)          • Teleport                  │
│  • provide/inject + InjectionKey • Composables               │
│  • expose + ref                  • Custom Events             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
vue3-tsx-todolist-demo
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx     ← ref, emits, expose, lifecycle
│   │   ├── TodoItem.tsx      ← props, emits, slots, inject
│   │   ├── TodoModal.tsx     ← Teleport, v-model, Transition
│   │   └── TodoFooter.tsx    ← inject (provide/inject demo)
│   │
│   ├── composables/
│   │   └── useTodos.ts       ← reactive, computed, watch, lifecycle
│   │
│   ├── options.ts            ← provide + InjectionKey (Symbol)
│   ├── styles.css            ← Global CSS (BEM naming)
│   ├── App.tsx               ← Root: setup + render function
│   └── main.ts               ← App entry
│
├── docs/
│   ├── 01-template-to-tsx.md
│   ├── 02-component.md
│   ├── 03-reactive.md
│   ├── 04-event.md
│   ├── 05-component-communication.md
│   ├── 06-slot.md
│   ├── 07-provide-inject.md
│   ├── 08-expose.md
│   ├── 09-life-cycle.md
│   └── 10-advanced.md
│
├── screenshots/              ← (Add your own screenshots here)
│   └── demo.png
│
├── README.md
└── package.json
```

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/your-username/vue3-tsx-todolist-demo.git
cd vue3-tsx-todolist-demo

# Install
npm install

# Dev server (with HMR)
npm run dev

# Type check
npm run type-check

# Production build
npm run build
```

Open http://localhost:5173 and start exploring!

---

## 📖 Documentation

`docs/zh/` 目录下每一章涵盖一个从 Vue Template 到 TSX 的具体迁移知识点：

| 章节 | 主题 | 核心差异 |
|---------|-------|----------------|
| [01](docs/zh/01-template-to-tsx.md) | Template → TSX | `{{ msg }}` → `{msg.value}` |
| [02](docs/zh/02-component.md) | defineComponent | Options API → setup() + render |
| [03](docs/zh/03-reactive.md) | ref / reactive | 自动解包 → 手动 `.value` |
| [04](docs/zh/04-event.md) | 事件处理 | `@click` → `onClick` |
| [05](docs/zh/05-component-communication.md) | Props & Emits | `$emit` → `emit()` |
| [06](docs/zh/06-slot.md) | 插槽（Slots） | `<slot>` → `{slots.default?.()}` |
| [07](docs/zh/07-provide-inject.md) | Provide / Inject | String key → Symbol key |
| [08](docs/zh/08-expose.md) | Expose | String ref → ref 对象 |
| [09](docs/zh/09-life-cycle.md) | 生命周期 | API 完全相同 |
| [10](docs/zh/10-advanced.md) | 高级主题 | Composables, Transition, Teleport |

---

## 💡 Why This Project?

As a Vue developer, I was comfortable with templates but felt lost when I first encountered TSX. The event names changed (`@click` → `onClick`), refs needed `.value`, and `v-for` became `list.map()`.

This project bridges that gap. Every line of code is annotated with the **template equivalent**, so you can learn TSX by comparing side-by-side with what you already know.

It's **not** just another TodoList — it's a **Vue3 TSX reference demo** you can return to whenever you forget the syntax.

---

## 🖼 Screenshots

<!-- Add your screenshots here -->
```
screenshots/demo.png
```

> TODO: Run `npm run dev` and take a screenshot of the app.

---

## 📄 License

MIT — feel free to use, modify, and share.

---

<p align="center">
  If this project helped you transition from Vue Template to TSX,
  <br/>
  consider giving it a ⭐ — it helps others discover it too!
</p>

<p align="center">
  <sub>Built with ❤️ for Vue developers exploring the TSX world</sub>
</p>

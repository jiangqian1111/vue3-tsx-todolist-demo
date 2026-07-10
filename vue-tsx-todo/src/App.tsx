/**
 * ======================================================
 *  App.vue → App.tsx
 *  Vue3 Template → TSX 学习 Demo
 * ======================================================
 *
 *  这是一个从 Vue3 Template 迁移到 TSX 的学习项目。
 *  每个文件通过代码 + 注释展示 template 与 TSX 的差异。
 *
 *  本文件展示：
 *   1. defineComponent + setup + render function
 *   2. ref / reactive
 *   3. computed
 *   4. watch + localStorage 持久化
 *   5. onMounted（生命周期）
 *   6. provide / inject
 *   7. Transition / TransitionGroup
 *   8. 组件 ref（expose 调用）
 *   9. 条件渲染
 *  10. 列表渲染
 */

import { defineComponent, ref, TransitionGroup, Transition } from "vue";
import { provideOptions, provideFooter } from "./options";
import { useTodos, type FilterType } from "./composables/useTodos";
import TodoInput, { type TodoInputExposed } from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import TodoFooter from "./components/TodoFooter";
import TodoModal from "./components/TodoModal";

export default defineComponent({
  // ============================
  //  defineComponent 的作用
  // ============================
  //
  // 【template 写法】        【TSX 写法】
  //   <script setup>          export default defineComponent({
  //   const count = ref(0)      setup() {
  //   </script>                  const count = ref(0)
  //   <template>                 return () => <div>{count.value}</div>
  //     {{ count }}             }
  //   </template>             })
  //
  // defineComponent 是 Vue3 给 TSX/JSX 用的组件定义语法
  // setup() 返回渲染函数 () => JSX

  setup() {
    // ============================
    //  ref — 响应式数据
    // ============================
    //
    // 【template】        【TSX】
    //   const x = ref(0)    const x = ref(0)
    //   {{ x }}             {x.value}
    //
    // 重要区别：template 自动解包 ref，TSX 中需要 .value

    const isModalOpen = ref(false);
    const filterButtons: FilterType[] = ["all", "done", "undone"];

    // ===== provide / inject =====
    //
    // provideFooter / provideOptions 内部调用了 provide()
    // 后代组件（TodoItem、TodoFooter）通过 inject() 获取
    // 详见 options.ts

    const opts = provideOptions();
    const footerText = provideFooter("Vue3 Template → TSX Learning Demo");

    // ===== Composable =====
    //
    // useTodos 封装了所有 todo 逻辑：
    //   - reactive list（响应式数组）
    //   - ref filter（过滤条件）
    //   - computed filteredList / stats
    //   - watch + localStorage（自动保存）
    //   - onMounted（恢复数据）
    //   - add / remove / toggle（操作方法）
    //
    // 详见 composables/useTodos.ts

    const todo = useTodos("vue3-tsx-todos");

    // ===== 组件 ref =====
    //
    // 【template 中的 ref 绑定】
    //   <TodoInput ref="inputRef" />
    //   // 通过 $refs.inputRef 访问
    //
    // 【TSX 中的 ref 绑定】
    //   const inputComp = ref<TodoInputExposed>()
    //   <TodoInput ref={inputComp} />
    //   // 通过 inputComp.value 访问
    //
    // 区别：
    //   - template：字符串 ref（this.$refs.xxx）
    //   - TSX：ref 对象直接绑定

    const inputComp = ref<TodoInputExposed>();

    // ============================
    //  Render 函数
    // ============================
    //
    // setup() 返回一个箭头函数，这就是组件的 render 函数
    // template 最终也被 Vue 编译成 render 函数，两者殊途同归

    return () => (
      <div class="app-container">
        {/* ===== Header ===== */}
        <header class="todo-header">
          <h1 class="todo-title">TodoList</h1>
          <p class="todo-subtitle">Vue3 Template → TSX Learning Demo</p>
        </header>

        <main class="todo-main">
          {/* ===== Theme Controls ===== */}
          {/* provide/inject 测试：修改主题色 */}
          <div class="theme-controls">
            <span class="theme-label">Theme: </span>
            <button
              class="theme-btn"
              style={{ backgroundColor: "#4f46e5" }}
              onClick={() => (opts.value.theme = "#4f46e5")}
            ></button>
            <button
              class="theme-btn"
              style={{ backgroundColor: "#0891b2" }}
              onClick={() => (opts.value.theme = "#0891b2")}
            ></button>
            <button
              class="theme-btn"
              style={{ backgroundColor: "#d97706" }}
              onClick={() => (opts.value.theme = "#d97706")}
            ></button>
            <button
              class="theme-btn"
              style={{ backgroundColor: "#dc2626" }}
              onClick={() => (opts.value.theme = "#dc2626")}
            ></button>
            <button
              class="btn btn-sm"
              onClick={() => (footerText.value = "✨ Updated via provide/inject!")}
            >
              Update Footer
            </button>
          </div>

          {/* ===== Input Area ===== */}
          {/* ref={inputComp} 绑定到子组件，可调用 expose 出的方法 */}
          {/* ref 期望 Ref<ComponentPublicInstance>，expose 类型不匹配，用 as any 绕过 */}
          {/* onAdd: Vue JSX 把 onXxx 编译为 emit 监听，但 TS 类型不识别，用 {...} 展开 */}
          <TodoInput ref={inputComp as any} {...{ 'onAdd': todo.add }} />

          {/* 父组件调用子组件 expose 的方法 */}
          <div class="expose-controls">
            <button class="btn btn-sm" onClick={() => inputComp.value?.focus()}>
              🔍 Focus Input
            </button>
            <button class="btn btn-sm" onClick={() => inputComp.value?.clear()}>
              🧹 Clear Input
            </button>
          </div>

          {/* ===== Filter + Stats ===== */}
          <div class="todo-controls">
            <div class="filter-group">
              {filterButtons.map((f) => (
                <button
                  key={f}
                  class={`filter-btn ${todo.filter.value === f ? "active" : ""}`}
                  onClick={() => (todo.filter.value = f)}
                >
                  {f === "all"
                    ? "All"
                    : f === "done"
                      ? "Completed"
                      : "Active"}
                </button>
              ))}
            </div>
            <div class="stats">
              <span class="stat-item">
                Total <strong>{todo.stats.value.total}</strong>
              </span>
              <span class="stat-item done">
                Done <strong>{todo.stats.value.done}</strong>
              </span>
              <span class="stat-item undone">
                Active <strong>{todo.stats.value.undone}</strong>
              </span>
            </div>
          </div>

          {/* ===== Todo List ===== */}
          {/*
            TransitionGroup — 列表动画

            【template 用法】
              <TransitionGroup name="todo" tag="div">
                <li v-for="item in list" :key="item.id">{{ item }}</li>
              </TransitionGroup>

            【TSX 用法】
              <TransitionGroup name="todo" tag="div">
                {list.map(item => <div key={item.id}>{item.task}</div>)}
              </TransitionGroup>

            name="todo" 对应 CSS 类前缀：
              .todo-enter-from   .todo-enter-active   .todo-enter-to
              .todo-leave-from   .todo-leave-active   .todo-leave-to
              .todo-move

            详见 styles.css
          */}
          <div class="todo-list">
            {/* TransitionGroup 的 tag 属性在 Vue JSX 类型中未定义 */}
            {/* 改为手动用 <div> 包裹实现相同效果 */}
            <TransitionGroup name="todo">
              {todo.filteredList.value.length === 0 ? (
                <div class="todo-empty" key="empty">
                  <p>
                    {todo.filter.value === "all"
                      ? "No tasks yet. Add one above!"
                      : "No matching tasks."}
                  </p>
                </div>
              ) : (
                todo.filteredList.value.map((item) => (
                  <TodoItem
                    key={item.id}
                    task={item.task}
                    done={item.done}
                    {...{ 'onToggle': () => todo.toggle(item.id) }}
                    {...{ 'onDel': () => todo.remove(item.id) }}
                  />
                ))
              )}
            </TransitionGroup>
          </div>

          {/* ===== Footer ===== */}
          <TodoFooter />
        </main>

        {/* ===== Open Modal Button ===== */}
        <div class="modal-trigger">
          <button
            class="btn btn-outline"
            onClick={() => (isModalOpen.value = true)}
          >
            Open Modal (Teleport demo)
          </button>
        </div>

        {/*
          Transition — 弹窗动画

          【template 用法】
            <Transition name="modal">
              <div v-if="isOpen">...</div>
            </Transition>

          【TSX 用法】
            <Transition name="modal">
              {isModalOpen.value && <div>...</div>}
            </Transition>
        */}
        <Transition name="modal">
          {isModalOpen.value && (
            <TodoModal
              visible={isModalOpen.value}
              {...{ 'onUpdate:visible': (val: boolean) => (isModalOpen.value = val) }}
              title="About This Demo"
            >
              {/* 默认插槽内容 */}
              <div class="modal-about">
                <p>
                  <strong>Vue3 + TSX TodoList</strong>
                </p>
                <p>
                  This demo showcases how to migrate from Vue3 Template syntax
                  to TSX/JSX. Each component is annotated with Template vs TSX
                  comparisons.
                </p>
                <p>Key topics covered:</p>
                <ul>
                  <li>defineComponent + setup()</li>
                  <li>ref / reactive / computed</li>
                  <li>props / emits / slots</li>
                  <li>provide / inject (InjectionKey)</li>
                  <li>expose + component ref</li>
                  <li>Transition / TransitionGroup</li>
                  <li>Teleport</li>
                  <li>Composables</li>
                  <li>watch + localStorage</li>
                  <li>Lifecycle hooks</li>
                </ul>
              </div>
            </TodoModal>
          )}
        </Transition>
      </div>
    );
  },
});

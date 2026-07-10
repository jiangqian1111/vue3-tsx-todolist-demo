/**
 * ======================================================
 *  TodoItem 组件 — 知识点集合
 * ======================================================
 *
 *  本文件展示：
 *   1. props（父传子）
 *   2. emits（子传父）
 *   3. slots（插槽） — 见下方注释对比，demo 中未启用 slots
 *   4. inject（接收祖先组件数据）
 */

import { defineComponent } from "vue";
import { useOptions } from "../options";

export default defineComponent({
  name: "TodoItem",

  // ===== 1. props =====
  //
  // 【template 写法】
  //   <script setup>
  //   const props = defineProps({ task: String, done: Boolean })
  //   </script>
  //   <template>{{ props.task }}</template>
  //
  // 【TSX 写法】
  //   props: { task: String, done: Boolean }
  //   setup(props) { ... props.task ... }
  //
  // template 中也可以用 defineProps，但 TSX 必须写在组件定义对象中
  // 父组件使用：<TodoItem task={item.task} done={item.done} />

  props: {
    task: { type: String, required: true },
    done: { type: Boolean, default: false },
  },

  // ===== 2. emits =====
  //
  // 【template】
  //   <div @click="$emit('toggle')">
  //   <button @click="$emit('del')">
  //
  // 【TSX】
  //   emits: ['toggle', 'del']
  //   <div onClick={() => emit('toggle')}>
  //   <button onClick={() => emit('del')}>

  emits: ["toggle", "del"],

  setup(props, { emit }) {
    // inject 接收祖先提供的主题色
    // 见 ../options.ts → provideOptions()
    const opts = useOptions();

    return () => (
      // 【template 中的 style】
      //   <div :style="{ color: theme }">
      //
      // 【TSX 中的 style】
      //   style={{ color: opts.value.theme }}
      //   — 对象样式，属性名用 camelCase
      //   — 自定义 CSS 变量（如 --todo-theme）需 as any 断言
      <div
        class="todo-item"
        style={{ "--todo-theme": opts.value.theme } as any}
        data-done={props.done}
      >
        {/* ===== 3. slots ===== */}
        {/*                                                    */}
        {/* 【template 插槽写法】                               */}
        {/*   <slot name="header" />                            */}
        {/*   <slot :status="status" />                         */}
        {/*   <template v-slot:header>...</template>            */}
        {/*   <template v-slot:default="scope">...</template>   */}
        {/*                                                     */}
        {/* 【TSX 插槽写法】                                    */}
        {/*   {slots.header?.()}                                */}
        {/*   {slots.default?.({ status: 'completed' })}        */}
        {/*                                                     */}
        {/* 父组件在 TSX 中传插槽：                             */}
        {/*   <TodoItem v-slots={{                              */}
        {/*     header: () => <strong>Title</strong>,          */}
        {/*     default: (scope) => <span>{scope.status}</span> */}
        {/*   }} />                                             */}
        {/*                                                     */}
        {/* ⚠️ 注意：v-slots 是 Vue JSX 编译器指令，           */}
        {/*    TypeScript 类型检查不识别，实际编译后运行正常     */}
        {/*    本 demo 未开启 slots 展示以避免 TS 报错           */}
        {/*    完整 slots 示例见 docs/06-slot.md                */}

        <div class="todo-item-body">
          <span class="todo-badge">{props.done ? "✅" : "⏳"}</span>
          <input
            type="checkbox"
            class="todo-checkbox"
            checked={props.done}
            onChange={() => emit("toggle")}
          />
          <span
            class={`todo-text ${props.done ? "done" : ""}`}
            onClick={() => emit("toggle")}
          >
            {props.task}
          </span>
        </div>

        <button
          class="btn btn-delete"
          onClick={() => emit("del")}
          title="Delete task"
        >
          ✕
        </button>
      </div>
    );
  },
});

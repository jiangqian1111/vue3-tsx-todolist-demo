/**
 * ======================================================
 *  TodoModal 组件 — 知识点集合
 * ======================================================
 *
 *  本文件展示：
 *   1. Teleport（传送门）
 *   2. v-model 模式（emit("update:visible")）
 *   3. slots（默认插槽）
 *   4. 条件渲染（{props.visible && ...}）
 */

import { defineComponent, Teleport } from "vue";

export default defineComponent({
  name: "TodoModal",

  props: {
    // required: true 表示该 prop 必须传递
    visible: { type: Boolean, required: true },
    title: { type: String, default: "" },
  },

  // ===== v-model 模式 =====
  //
  // 【template 中的 v-model】
  //   <Child v-model:visible="isOpen" />
  //
  //   等价于：
  //   <Child :visible="isOpen" @update:visible="val => isOpen = val" />
  //
  // 【TSX 中的 v-model】
  //   1. 组件中 emits: ["update:visible"]
  //   2. 调用 emit("update:visible", newValue)
  //   3. 父组件中：
  //      <TodoModal visible={isOpen.value} onUpdate:visible={val => isOpen.value = val} />
  //
  // 这在 TSX 中称为 "v-model 约定" — 不是语法糖，而是手动实现

  emits: ["update:visible"],

  setup(props, { slots, emit }) {
    return () => (
      // ===== Teleport =====
      //
      // 【template 写法】
      //   <Teleport to="body">
      //     <div class="modal">...</div>
      //   </Teleport>
      //
      // 【TSX 写法】
      //   <Teleport to="body">
      //     {props.visible && <div>...</div>}
      //   </Teleport>
      //
      // Teleport 的作用：把子元素渲染到 DOM 的另一个位置（如 body）
      // 适合：弹窗、下拉菜单、提示条（避免被父元素 overflow:hidden 裁剪）

      <Teleport to="body">
        {/*
          TSX 中的条件渲染：
          template: <div v-if="visible">
          TSX:     {props.visible && <div>}
          JS 的 && 短路求值：前面为 true 才渲染后面
        */}
        {props.visible && (
          <div class="modal-mask" onClick={() => emit("update:visible", false)}>
            <div class="modal-content" onClick={(e) => e.stopPropagation()}>
              <div class="modal-header">
                <h2 class="modal-title">{props.title}</h2>
                <button
                  class="modal-close"
                  onClick={() => emit("update:visible", false)}
                >
                  ✕
                </button>
              </div>
              <div class="modal-body">
                {/* 默认插槽：{slots.default?.()} */}
                {slots.default?.()}
              </div>
            </div>
          </div>
        )}
      </Teleport>
    );
  },
});

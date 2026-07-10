/**
 * ======================================================
 *  TodoInput 组件 — 知识点集合
 * ======================================================
 *
 *  本文件展示以下 Vue3 TSX 知识点：
 *   1. defineComponent
 *   2. ref
 *   3. emits（子传父）
 *   4. expose（暴露方法给父组件）
 *   5. onMounted + nextTick（生命周期）
 *   6. 事件绑定（onKeyup / onClick）
 */

import { defineComponent, ref, onMounted, nextTick } from "vue";

// 导出 exposed 类型，供父组件 ref 时获得类型提示
export interface TodoInputExposed {
  focus: () => void;
  clear: () => void;
}

export default defineComponent({
  name: "TodoInput",
  emits: ["add"],

  setup(props, { emit, expose }) {
    // template: const text = ref('') → {{ text }}
    // TSX:     const text = ref('') → {text.value}
    const text = ref("");
    const inputRef = ref<HTMLInputElement>();

    // 生命周期：template 和 TSX 完全一致
    onMounted(() => {
      nextTick(() => {
        inputRef.value?.focus();
      });
    });

    // template: @keyup.enter="handleAdd"
    // TSX:     onKeyup={e => e.key === 'Enter' && handleAdd()}
    const handleAdd = () => {
      if (text.value.trim()) {
        emit("add", text.value);
        text.value = "";
        inputRef.value?.focus();
      }
    };

    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAdd();
      }
    };

    // expose — 控制哪些属性和方法暴露给父组件
    // 不写 expose：全部暴露（text, inputRef, handleAdd 都可见）
    // 写了 expose：只暴露 focus 和 clear
    const focus = () => {
      inputRef.value?.focus();
    };

    const clear = () => {
      text.value = "";
      inputRef.value?.focus();
    };

    expose({ focus, clear });

    return () => (
      <div class="input-area">
        {/* v-model 在 TSX 中的用法：v-model={text.value}                  */}
        {/* 由 @vitejs/plugin-vue-jsx 编译为 value + onInput             */}
        {/* 如果 TS 报错，可以改为：                                      */}
        {/*   value={text.value}                                         */}
        {/*   onInput={(e: Event) => (text.value = (e.target as HTMLInputElement).value)} */}
        <input
          ref={inputRef}
          class="todo-input"
          type="text"
          placeholder="What needs to be done?"
          value={text.value}
          onInput={(e: Event) => {
            text.value = (e.target as HTMLInputElement).value;
          }}
          onKeyup={handleKeyup}
        />
        <button class="btn btn-primary" onClick={handleAdd}>
          Add
        </button>
      </div>
    );
  },
});

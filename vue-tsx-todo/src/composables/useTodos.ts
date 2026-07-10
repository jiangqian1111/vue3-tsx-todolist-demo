/**
 * ======================================================
 *  第 5 步：Composable — 把逻辑从组件中抽离
 * ======================================================
 *
 * 【Composable 是什么】
 *   Vue3 中，利用 Composition API 封装可复用逻辑的函数叫做 composable。
 *   它可以包含 ref、reactive、computed、watch、生命周期等所有 Vue 能力。
 *
 *   template 写法中，逻辑分散在 data / methods / watch / computed 里。
 *   TSX + Composition API 中，逻辑可以整合在 composable 函数中，按功能组织。
 *
 * 【template 对应】
 *   export default {
 *     data() { return { list: [], filter: 'all' } },
 *     computed: { filteredList() { ... } },
 *     watch: { list: { handler() { localStorage.set(...) }, deep: true } },
 *     methods: { add(task) { ... } }
 *   }
 *
 * 【TSX 对应】
 *   export function useTodos(key) {
 *     const list = reactive([])
 *     const filteredList = computed(() => ...)
 *     watch(() => [...list], ...)
 *     const add = (task) => { ... }
 *     return { list, filteredList, add }
 *   }
 */

import { reactive, ref, computed, watch, onMounted } from "vue";

// ===== 类型定义 =====

export interface Todo {
  id: number;
  task: string;
  done: boolean;
}

/** 过滤条件：联合类型限制合法值（"all" | "done" | "undone"） */
export type FilterType = "all" | "done" | "undone";

// ===== Composable =====

export function useTodos(storageKey = "todos") {
  // ─── 状态 ───
  // template: data() { return { list: [] } }
  // TSX:      reactive([]) — 整个数组可响应

  const list = reactive<Todo[]>([]);
  const filter = ref<FilterType>("all");

  // ─── 计算属性 ───
  // template: computed: { filteredList() { ... } }
  // TSX:      const filteredList = computed(() => ...)
  //           使用时：filteredList.value（TSX 没有自动解包！）

  const filteredList = computed(() => {
    switch (filter.value) {
      case "done":
        return list.filter((item) => item.done);
      case "undone":
        return list.filter((item) => !item.done);
      default:
        return list;
    }
  });

  const stats = computed(() => ({
    total: list.length,
    done: list.filter((item) => item.done).length,
    undone: list.filter((item) => !item.done).length,
  }));

  // ─── 操作方法 ───

  const add = (task: string) => {
    list.push({ id: Date.now(), task, done: false });
  };

  const remove = (id: number) => {
    const index = list.findIndex((item) => item.id === id);
    if (index > -1) {
      list.splice(index, 1);
    }
  };

  const toggle = (id: number) => {
    const item = list.find((item) => item.id === id);
    if (item) {
      item.done = !item.done;
    }
  };

  // ─── 生命周期 ───
  // template 和 TSX 生命周期 API 完全相同！
  // onMounted / onUnmounted / onUpdated 等用法一致

  onMounted(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved) as Todo[];
        list.splice(0, list.length, ...data);
      } catch {
        console.warn(
          `[useTodos] localStorage key="${storageKey}" parse failed`
        );
      }
    }
  });

  // ─── 侦听器 ───
  // template:
  //   watch: {
  //     list: { handler(val) { localStorage.setItem(key, JSON.stringify(val)) }, deep: true }
  //   }
  //
  // TSX:
  //   watch(() => [...list], (newVal) => { ... })
  //   → 用 () => [...list] 创建 shallow copy，只在新旧引用不同时触发
  //   → 代替 deep: true（性能更好）

  watch(
    () => [...list],
    (newVal) => {
      localStorage.setItem(storageKey, JSON.stringify(newVal));
    }
  );

  return {
    list,
    filter,
    filteredList,
    stats,
    add,
    remove,
    toggle,
  };
}

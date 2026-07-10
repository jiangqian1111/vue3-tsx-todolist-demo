/**
 * ======================================================
 *  Provide / Inject — 跨组件共享状态
 * ======================================================
 *
 * 【template 写法】
 *   // 祖先组件提供
 *   provide('theme', ref('blue'))
 *
 *   // 后代组件注入
 *   const theme = inject('theme')
 *
 * 【TSX 写法 + 知识点】
 *   // 完全相同的 API，但多了 InjectionKey 类型保护
 *   // key 使用 Symbol 而非字符串，避免命名冲突
 *
 * 为什么要用 InjectionKey + Symbol 而不是字符串？
 *   - 字符串：provide('theme', ...) / inject('theme') — 拼写错误不报错
 *   - Symbol：provide(THEME_KEY, ...) / inject(THEME_KEY) — 类型自动推导
 *     Symbol 是 JS 的唯一值，不可能和别人重复，注入方和提供方保证是同一个 key
 */

import { provide, inject, ref, type Ref, type InjectionKey } from "vue";

// ===== 类型定义 =====

export interface Options {
  theme: string;
  showDate: boolean;
}

// ===== InjectionKey（Symbol 作为 key） =====

// template 写法：
//   provide('footer-text', footerText)
//   inject('footer-text')
//
// TSX 写法（推荐）：
//   用 InjectionKey<Ref<string>> = Symbol('...')
//   → provide(FooterKey, footerText)  // 编译器知道 footerText 必须是 Ref<string>
//   → inject(FooterKey)               // 返回值自动推导为 Ref<string> | undefined

export const FooterKey: InjectionKey<Ref<string>> = Symbol("footer-text");

export const OptionsKey: InjectionKey<Ref<Options>> = Symbol("options");

// ===== Provider 函数（封装 provide 调用） =====

/**
 * 提供底部文字 — 演示 provide/inject 跨组件通信
 * App.tsx 调用 provideFooter(...) → TodoFooter.tsx 调用 inject(FooterKey)
 */
export const provideFooter = (text: string) => {
  const footerText = ref(text);
  provide(FooterKey, footerText);
  return footerText;
};

/**
 * 提供全局配置（主题色等）
 * App.tsx 调用 provideOptions() → TodoItem.tsx 调用 useOptions()
 */
export const provideOptions = () => {
  const options = ref<Options>({
    theme: "#4f46e5",
    showDate: true,
  });
  provide(OptionsKey, options);
  return options;
};

// ===== Injector 函数 =====

export const useOptions = () => {
  // 非空断言：调用者保证使用前已 provide
  return inject(OptionsKey)!;
};

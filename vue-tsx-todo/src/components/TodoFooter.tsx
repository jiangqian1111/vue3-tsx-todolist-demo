/**
 * ======================================================
 *  TodoFooter — inject 演示（provide/inject 通信）
 * ======================================================
 *
 * 【template 中 inject 写法】
 *   <script setup>
 *   const footerText = inject('footer-text', '默认值')
 *   </script>
 *   <footer>{{ footerText }}</footer>
 *
 * 【TSX 写法】
 *   import { FooterKey } from "../options";
 *   const footerText = inject(FooterKey, ref("默认底部信息"));
 *   <footer>{footerText.value}</footer>
 *
 * 区别：
 *   - template 自动解包 ref，不需要 .value
 *   - TSX 中 ref 需要 .value
 *   - 都用 InjectionKey（Symbol）保证类型安全
 */

import { defineComponent, inject, ref } from "vue";
import { FooterKey } from "../options";

export default defineComponent({
  name: "TodoFooter",
  setup() {
    // inject(FooterKey) 返回类型自动推导为 Ref<string> | undefined
    // 第二个参数提供默认值
    const footerText = inject(FooterKey, ref("Default footer text"));

    return () => (
      <footer class="todo-footer">
        <span>{footerText.value}</span>
      </footer>
    );
  },
});

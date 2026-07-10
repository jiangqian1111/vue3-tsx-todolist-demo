/**
 * ======================================================
 *  main.ts — 应用入口
 * ======================================================
 *
 *  Vue3 应用启动流程（template 和 TSX 完全一致）：
 *    1. createApp(App) 创建应用实例
 *    2. app.mount("#app") 挂载到 DOM
 *
 *  如果使用 router / pinia，也是在这中间 .use()
 */

import { createApp } from "vue";
import App from "./App";
import "./styles.css";

const app = createApp(App);
app.mount("#app");

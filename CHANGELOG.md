# Changelog

## 0.1.0-rc.10 - 2026-09-10

- **修复安装失败**:官方已把客户端门面包 `@deepseek-ai/dsh-client-runtime` 拆掉(现在由 `dsh-client-ui-renderer` 提供 `ctx.slots`、`dsh-client-ui-session` 提供 `useSessions`),插件 `package.json` 里指向它的 `workspace:^` 依赖会让 `pnpm install` 直接报 `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`,CI 因此变红。
- 客户端类型导入改用官方现写法:客户端上下文直接从 `@deepseek-ai/cordis` 取 `Context`,各服务合并分别从声明它的包 `import type {}`;`dsh.client.inject` 同步改为 `dsh-client-ui-renderer` / `dsh-client-ui-session` / `dsh-client-ui-sidebar`。
- CI 的 harness checkout **钉到固定 ref**(`aa8262e`,2026-09-10),不再跟随上游默认分支漂移——上游每次改名都会打穿这套第三方插件的构建。

## 0.1.0-rc.9 - 2026-09-10

- 跟进官方 **2026-09-10 12:00(北京时间)** 生效的 V4.1-Flash 新价表:Flash 空闲时段 0.02 / 1.0 / 4.0 元、高峰时段 0.04 / 2.0 / 8.0 元(命中 / 未命中输入 / 输出,每百万 token)。此前卡片一直沿用 2026-08-17 那一版价格。
- 同步修正高峰期定义:自 2026-09-10 12:00 起高峰只算**工作日** 9:00–12:00、14:00–18:00,周末计入空闲时段;2026-08-17 至 2026-09-10 之间的请求仍按当时的"每天 9:00–12:00、14:00–18:00"计,不追溯改账。
- 价表改为**按北京时间生效节点分段**的结构,官方以后再调价只需追加一段,历史会话仍按各自当时的费率逐条计价。
- 跟进官方 **2026-09-14 12:00** 起把 `deepseek-v4-pro` 请求路由到 V4.1-Flash 的调整:该时点之后 pro 请求按 Flash 价格计费,不再套用 Pro 价表;`billedFamily()` 只对**明确写了 pro 的模型名**生效,无法识别的模型仍按 Pro 保守估计。
- 卡片费率说明里的模型名更新为 DeepSeek-V4.1-Flash。

## 0.1.0-rc.8 - 2026-08-19

- 修正展开箭头方向:卡片位于侧边栏底部、详情向上生长,收起态箭头向上、展开态箭头向下。

## 0.1.0-rc.7 - 2026-08-19

- 余额请求改用宿主原生 `fetch`,弃用 shell + curl,修复 Windows 下 schannel 凭据失败与 API Key 环境变量无法传入子进程的问题(#1)。
- 非 JSON 与非 2xx 响应给出可读错误信息,不再暴露原始解析异常。

## 0.1.0-rc.6 - 2026-08-19

- 改用 DSH rc.7 官方 `sidebar.footer.action`,无需修改官方侧边栏 bundle。
- 将余额请求、价格计算、用量折叠、状态路由和客户端组件拆分为独立模块。
- 删除根目录重复源码与 bundle,保留 `src/` 真源和 `lib/` 安装产物。
- 补充可重复构建、单元测试、产物校验与 GitHub Actions。

## 0.1.0-rc.5

- 提供侧边栏余额、当前会话费用估算、峰谷价格和展开详情。
- 支持通过 `dsh plugin add` 从 GitHub 直接安装。

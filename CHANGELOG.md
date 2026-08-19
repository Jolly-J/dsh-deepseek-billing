# Changelog

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

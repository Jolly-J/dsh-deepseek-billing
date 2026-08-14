# dsh-deepseek-billing

DSH **WebUI 插件**:侧边栏 DeepSeek 账户余额显示 + 按会话费用估算。

> 这是一个面向 DSH Web UI 的界面插件(不是 agent 工具插件)。安装后会在 DSH Web 界面的左侧边栏底部、设置按钮上方出现一张悬浮卡片。

## 功能

- **摘要行**:状态点 · `余额:¥xx.xx元`(左)· `会话:¥x.xxx`(右)· 刷新按钮 · 展开箭头;
- **展开详情**:充值 / 赠送余额、输入 / 缓存命中 / 输出 token、会话费用估算、计价档位说明与更新时间;
- 点击摘要行展开/收起,点击卡片外部自动收起,数字滚动过渡,切换会话自动切换对应会话的消耗;
- 窄栏(侧边栏收起)状态不渲染,不干扰布局;
- 每 60 秒自动刷新,数据获取耗时显示在卡片底部。

## 数据来源与计价

- **余额**:官方 `GET {baseURL}/user/balance` 接口,复用模型路由的同一把 API Key,30 秒缓存;
- **用量**:直接遍历 DSH 会话日志中模型调用的 usage 记录(优先内存事件,冷会话回落持久化日志);
- **计价**:内置 DeepSeek 官方价格表(V4-Flash / V4-Pro,缓存命中 / 未命中 / 输出),按每条消息的时间戳自动套用 2026-08-17 起生效的峰谷定价与旧价表;
- 输入口径与 DSH 统计行一致:计费输入 = 未缓存 + 缓存命中 + 缓存写入。

## 安装(推荐:让 DSH 智能体帮你装)

本插件按 DSH 官方教程的包形态组织,可以作为一个包直接放入 DSH 仓库。最简单的安装方式是**把本仓库地址发给你的 DSH 智能体**,对它说:

> 把这个插件装到我的 DSH 里:https://github.com/<你的用户名>/dsh-deepseek-billing

智能体需要完成(以下清单也写入了仓库结构,agent 可以直接照做):

1. 将本仓库克隆/复制到 DSH 仓库的 `packages/extensions/dsh-deepseek-billing`;
2. 在 `packages/bundle/web-app/cordis.patch.yml` 的 browser roster 区加入:

```yaml
- id: ui-deepseek-billing
  name: 'dsh-deepseek-billing'
```

3. 在 `packages/bundle/web-app/package.json` 的 `dependencies` 中加入:

```json
"dsh-deepseek-billing": "workspace:^"
```

4. 在根 `tsconfig.client.json` 的 `references` 中加入 `{ "path": "./packages/extensions/dsh-deepseek-billing" }`;
5. 执行 `pnpm install`,再构建本包:`pnpm --filter dsh-deepseek-billing bundle`;
6. 重启 `dsh web`。

### 手动安装

与上面清单相同,自己完成 1–6 步即可。注意:`pnpm` 版本要求 11.7.0(与 DSH 仓库的 `packageManager` 一致)。

## 密钥与安全说明(必读)

本插件**不读取、不存储你的 API Key**,但它需要密钥才能调用官方余额接口,因此请了解以下事实:

1. **密钥从哪来**:插件通过 DSH 的 `credentials` 服务解析与模型路由**同一把** `DEEPSEEK_API_KEY`(或你在 `llm-deepseek` 设置段自定义的 `apiKeyEnv`)。插件自己没有独立的密钥配置。
2. **明文密钥的轨迹**:解析出的密钥明文只短暂存在于插件所在进程的内存中,并以**环境变量**的形式传给一次 `curl` 子进程,仅用于向 DeepSeek 官方余额接口发送 `Authorization` 请求头。插件**不会**:
   - 把密钥写入磁盘、日志或任何缓存(缓存的只有余额数字);
   - 把密钥放进命令行参数(因此 `ps` 等工具无法从 argv 看到它);
   - 把密钥返回给浏览器或 `/billing/status` 接口(该接口只返回余额数字与 token 用量);
   - 把密钥发送到除配置的 DeepSeek 端点以外的任何地址。
3. **已知暴露面**(任何使用这把密钥的程序都存在的通用风险):
   - 同一台机器上、具有相同用户权限的进程可以读取 curl 子进程的环境变量,从而获得密钥明文——这是操作系统层面的通用事实,不是本插件特有的缺陷;
   - 局域网内能访问 DSH web 端口的调用者可以请求 `/billing/status`,得知你的**账户余额数字**(密钥本身不会暴露)。如需收紧,请在部署层面对该路径加访问控制。
4. **开源安全**:本仓库中不包含任何硬编码密钥,代码里只有环境变量**名字**字符串 `DEEPSEEK_API_KEY`。

## 已知限制

- 余额接口为局域网可见(只暴露余额数字,不暴露密钥);
- 价格表内置于代码,官方调价需更新插件版本(官方无价格 API);
- 费用仅统计当前会话,子代理会话未汇总;
- 文案目前为中文,尚未接入 i18n。

## License

MIT

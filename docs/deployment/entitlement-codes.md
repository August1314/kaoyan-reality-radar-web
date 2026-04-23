# 完整权益码运营说明

当前版本不接自动邮件或短信。限时内测期采用“填写择校问卷 -> 人工发送唯一完整权益码 -> 站内兑换”的流程。

- 基础体验：可先查看 2 个目标和少量失败经验。
- 完整权益码：问卷提交后人工发送，兑换后开启不限目标浏览、完整失败经验库、全站统计、CSV 导出和分享卡片。
- 联系邮箱：`august20050716@gmail.com`

## 环境变量

Vercel 项目需要配置：

```bash
KV_REST_API_URL=<vercel-kv-rest-url>
KV_REST_API_TOKEN=<vercel-kv-rest-token>
ALLOWED_ORIGINS=https://kaoyan-reality-radar-web.vercel.app,https://august1314.github.io
```

部署后可用以下接口确认配置状态，不会返回任何密钥：

```bash
curl https://kaoyan-reality-radar-web.vercel.app/api/entitlements/health
```

期望：

```json
{"ok":true,"kvConfigured":true,"allowedOriginsConfigured":true}
```

GitHub Pages 镜像构建时需要：

```bash
VITE_ENTITLEMENT_API_BASE=https://kaoyan-reality-radar-web.vercel.app
```

## 生成人工发放码

在本机配置 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 后运行：

```bash
npm run codes:create -- --level paid --count 20
```

脚本会：

- 生成高熵随机码。
- 写入 Vercel KV：`code:{CODE}`。
- 输出本地 CSV 到 `private/codes-paid-*.csv`。

`private/` 已加入 `.gitignore`，不要提交兑换码 CSV。

`survey` 层仍保留为兼容旧码和测试，不作为当前主流程推广。

## 人工发码流程

1. 用户在 `/unlock` 打开择校问卷并提交邮箱或手机号。
2. 运营人员从 `private/codes-paid-*.csv` 取一枚未使用完整权益码。
3. 通过问卷中填写的邮箱或手机号发送权益码。
4. 用户回到 `/unlock` 输入权益码。
5. 兑换成功后，完整权益绑定到当前浏览器设备。

## 上线前检查

每次发布前运行：

```bash
npm run build
npm run prepare:mirror
npm run verify:controlled-content
```

检查目标：

- 前端包不包含旧固定码 `YAN2026` / `RADAR99`。
- `public/`、`dist/`、`mirror-dist/` 不包含 `data/failures.json`。
- 构建产物不包含完整失败经验 JSON 的 `review` 字段。
- 用户可见页面不出现收款、价格或支付方式文案。

注意：如果 GitHub 仓库保持公开，源码和历史提交中的数据仍可能被技术用户查看。当前方案控制的是线上站点和镜像产物，不等同于强会员系统。

## 兑换规则

- 权益码只由服务端校验，前端不包含固定码。
- 未使用的码第一次兑换时绑定当前匿名设备 ID。
- 同一设备重复兑换同一码允许返回当前权益。
- 不同设备兑换已绑定码会失败。
- 这能降低普通传播复用，但不能防止用户复制浏览器存储或共享设备数据。

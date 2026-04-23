# 兑换码运营说明

当前版本不接真实收款，采用人工发放一人一码：

- 问卷解锁码：填写问卷后人工发放，解锁更多失败经验。
- 完整解锁码：人工确认后发放，解锁完整失败经验库、完整 CSV 和分享卡片能力。

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

## 生成兑换码

在本机配置 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 后运行：

```bash
npm run codes:create -- --level survey --count 20
npm run codes:create -- --level paid --count 20
```

脚本会：

- 生成高熵随机码。
- 写入 Vercel KV：`code:{CODE}`。
- 输出本地 CSV 到 `private/codes-*.csv`。

`private/` 已加入 `.gitignore`，不要提交兑换码 CSV。

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

注意：如果 GitHub 仓库保持公开，源码和历史提交中的数据仍可能被技术用户查看。当前方案控制的是线上站点和镜像产物，不等同于强会员系统。

## 兑换规则

- 解锁码只由服务端校验，前端不再包含固定码。
- 未使用的码第一次兑换时绑定当前匿名设备 ID。
- 同一设备重复兑换同一码允许返回当前权限。
- 不同设备兑换已绑定码会失败。
- 这能降低普通传播复用，但不能防止用户复制浏览器存储或共享设备数据。

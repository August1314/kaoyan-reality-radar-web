# 中国用户访问快速方案

当前生产站仍在 Vercel：`https://kaoyan-reality-radar-web.vercel.app`。面向中国考研党时，不应长期主推 `.vercel.app` 域名，因为 Vercel 官方也说明中国大陆访问可能出现性能退化或不可达。

## v1 路线

- 保留 Vercel 作为开发、海外访问和 GitHub 自动部署主链路。
- 购买并绑定自有域名，公开传播时使用自有域名，不直接传播 `.vercel.app`。
- 生成纯静态 `dist/`，再复制到 `mirror-dist/`，上传到香港或海外静态托管、对象存储或静态 CDN。
- 暂不启用中国大陆 CDN，不提交备案，不开通会产生费用的服务；这些动作必须人工确认。

## 本地准备命令

```bash
npm run build
npm run prepare:mirror
```

产物目录：

```text
mirror-dist/
```

上传时需要保证以下路径可直接访问：

- `/`
- `/result/<slug>`
- `/unlock`
- `/data/failures.json`
- `/sitemap.xml`
- `/robots.txt`

如果目标托管平台不支持 SPA history fallback，必须配置所有未知路径回退到 `/index.html`。

## 验收标准

- 首页可打开。
- 搜索后结果页可打开。
- 刷新结果页不 404。
- `/unlock` 可打开。
- `/data/failures.json` 返回 200。
- 移动端能打开问卷和付费登记入口。

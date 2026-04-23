# 中国用户访问快速方案

当前生产站仍在 Vercel：`https://kaoyan-reality-radar-web.vercel.app`。面向中国考研党时，不应长期主推 `.vercel.app` 域名，因为 Vercel 官方也说明中国大陆访问可能出现性能退化或不可达。

## v1 路线

- 保留 Vercel 作为开发、海外访问和 GitHub 自动部署主链路。
- 购买并绑定自有域名，公开传播时使用自有域名，不直接传播 `.vercel.app`。
- 生成纯静态 `dist/`，再复制到 `mirror-dist/`，上传到香港或海外静态托管、对象存储或静态 CDN。
- 暂不启用中国大陆 CDN，不提交备案，不开通会产生费用的服务；这些动作必须人工确认。

## 本地准备命令

默认构建会使用 Vercel 生产域名。准备自有域名或镜像站时，先通过环境变量指定公开访问地址：

```bash
VITE_SITE_URL=https://your-domain.example npm run build
npm run prepare:mirror
```

如果镜像站部署在子路径下，同时设置 `VITE_BASE_PATH`：

```bash
VITE_SITE_URL=https://august1314.github.io/kaoyan-reality-radar-web \
VITE_BASE_PATH=/kaoyan-reality-radar-web/ \
npm run build
npm run prepare:mirror
```

也可以在本地创建不提交的 `.env`：

```bash
VITE_SITE_URL=https://your-domain.example
VITE_BASE_PATH=/
```

然后执行：

```bash
npm run build
npm run prepare:mirror
```

`prepare:mirror` 会在 `mirror-dist/` 内额外写入：

- `404.html`：复制自 `index.html`，用于静态托管平台的 SPA history fallback。
- `.nojekyll`：避免 GitHub Pages 以 Jekyll 规则处理静态产物。
- `mirror-manifest.json`：记录产物来源和生成时间。

## GitHub Pages 临时镜像

仓库已提供手动触发的 workflow：

```text
.github/workflows/china-mirror-pages.yml
```

默认参数：

- `site_url`: `https://august1314.github.io/kaoyan-reality-radar-web`
- `base_path`: `/kaoyan-reality-radar-web/`

第一次使用前，需要在 GitHub 仓库 Settings -> Pages 中把发布来源设为 GitHub Actions，或者用 GitHub API 启用 Pages workflow 发布。启用后，手动运行 `China Mirror - GitHub Pages` workflow 即可生成临时公开镜像。

注意：GitHub Pages 不是面向中国大陆访问的最终方案，只适合作为零成本临时镜像和部署链路验证。正式面向中国考研党传播时，仍建议使用自有域名 + 香港/海外静态托管；若后续要走中国大陆 CDN，需先完成备案。

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

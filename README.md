# 考研现实雷达 MVP

一个超小型考研择校现实判断工具原型。

## 当前范围
- 首页搜索
- 结果页难度雷达
- 失败经验卡片
- 失败经验详情页
- 投稿说明页

## 技术栈
- Vite
- React
- TypeScript
- react-router-dom

## 当前状态
- 已接入真实整理数据，并支持通过脚本同步发布态数据
- 已完成首页搜索、目标判断、失败经验详情、匿名投稿说明等最小闭环
- 投稿页已接入真实飞书表单
- 已支持通过 GitHub Actions 自动触发 Vercel Preview / Production 部署

## 数据目录
- `data/raw/`：原始采集数据模板与手工整理素材
- `data/processed/`：清洗后的中间数据
- `src/data/`：前端直接使用的发布态静态数据
- `scripts/sync-data.ts`：将 `verified` 状态的数据同步到 `data/processed/` 与 `src/data/`

当前已提供：
- `data/raw/programs.template.json`
- `data/raw/failures.template.json`
- `data/raw/programs.batch-001.json`
- `data/raw/failures.batch-001.json`
- `data/processed/programs.json`
- `data/processed/failures.json`
- `data/processed/programs.batch-001.json`
- `data/processed/failures.batch-001.json`

同步命令：
```bash
npm run sync:data
```

只有 `status: "verified"` 的记录会被同步到发布态数据。

## 本地开发
```bash
npm install
npm run dev
```

## 生产构建
```bash
npm run build
```

## 自动部署

仓库配置了 GitHub Actions 与 Vercel 联动：

- 非 `main` 分支 push：自动创建 Preview Deployment
- `main` 分支 push：自动发布到 Production

依赖以下 GitHub Repository Secrets：

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

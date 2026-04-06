# 考研现实雷达 MVP

一个超小型考研择校现实判断工具原型。

## 当前范围
- 首页搜索
- 已收录目标浏览
- 结果页难度判断
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
- 当前发布态已有 8 个 verified program、22 条 verified failure
- 已完成首页搜索、目标判断、失败经验浏览、失败详情、匿名投稿说明等最小闭环
- 投稿页已接入真实飞书表单
- 已支持通过 GitHub Actions 自动触发 Vercel Preview / Production 部署
- 当前生产地址：`https://kaoyan-reality-radar-web.vercel.app`

## 数据目录
- `data/raw/`：原始采集数据模板与按批次整理的手工素材
- `data/processed/`：同步脚本生成的清洗中间数据
- `src/data/`：前端直接使用的发布态静态数据
- `scripts/sync-data.ts`：将 `verified` 状态的数据同步到 `data/processed/` 与 `src/data/`
- 批次文件会持续追加，当前仓库里的数据以 `batch-001`、`batch-002`、`batch-003`、`batch-004` 等文件为主

当前已知数据口径：
- 只有 `status: "verified"` 的记录会进入发布态
- 发布态数据以 `src/data/programs.ts` 和 `src/data/failures.ts` 为准
- 原始数据与中间数据保留在 `data/raw/` 和 `data/processed/`，用于持续补录和复核

同步命令：
```bash
npm run sync:data
```

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

## 当前协作方式
- 先补真实数据，再做最小页面优化。
- 所有新数据先进入 `data/raw/`，通过 `npm run sync:data` 同步到发布态。
- 前端改动只服务于搜索、浏览、判断、投稿四个核心闭环。

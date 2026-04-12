# 考研现实雷达

一个超小型考研择校现实判断工具原型。

## 功能

- **首页搜索**：智能搜索学校+专业，支持搜索历史记录
- **目标判断**：雷达图可视化难度评估
- **失败经验**：浏览失败案例，展开查看详情
- **专业对比**：最多同时对比 3 个专业，查看雷达图与关键指标
- **数据统计**：查看收录样本、学校分布、专业分布与风险标签
- **分享功能**：支持 Web Share API 和复制链接
- **辅助体验**：暗色模式、键盘快捷键、滚动恢复、无障碍基础支持

## 技术栈

- Vite + React + TypeScript
- react-router-dom
- 纯 CSS（无 UI 框架）

## 数据状态

- **Programs**: 149 个已验证目标
- **Failures**: 197 条失败经验
- **Schools**: 44 所院校
- **Majors**: 55 个专业方向

## 开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run lint     # 代码检查
npm test         # 运行最小测试闭环
npm run sync:data # 从 data/raw 同步发布态数据
```

## 部署

- **生产地址**: https://kaoyan-reality-radar-web.vercel.app
- **GitHub Actions**: 自动 CI + Vercel 部署
- 非 main 分支 → Preview Deployment
- main 分支 → Production Deployment

## 数据管理

```bash
npm run sync:data   # 同步数据到发布态
```

- `data/raw/` - 原始采集数据
- `data/processed/` - 清洗中间数据
- `src/data/` - 前端发布态数据

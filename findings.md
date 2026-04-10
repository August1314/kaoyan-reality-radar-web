# 研究发现

## 移动端适配检查

### 首页 (HomePage)
- (待检查)

### 结果页 (ResultPage)
- (待检查)

### 失败详情页 (FailureDetailPage)
- (待检查)

---

## 技术发现

### localStorage 使用
- 搜索历史：key 建议用 `kaoyan-search-history`
- 收藏功能：key 建议用 `kaoyan-favorites`
- 最大存储：10 条历史足够

### 分享功能
- Web Share API：`navigator.share()` 支持度良好
- 降级方案：`navigator.clipboard.writeText()` 复制链接

# data/raw 录入说明

这里存放**首批真实数据的原始录入文件**，不直接给前端使用。

## 目录约定
- `programs.batch-001.json`：首批院校/专业卡片原始数据
- `failures.batch-001.json`：首批失败经验原始数据
- `*.template.json`：字段模板，不作为正式数据

## 使用原则
- 这里只录入**真实考研数据**，不要混入示例数据。
- 一条数据如果来源不清、字段缺失严重、无法复核，就不要进入这里。
- 原始录入允许保留空字段，但要把 `status` 标成 `todo` 或 `draft`。
- 只有完成核对的数据，才进入 `data/processed/`，再同步到 `src/data/`。

## Program 字段说明
每条 program 对应一个“学校 + 专业 + 年份”的目标卡片。

字段：
- `id`：唯一标识，建议格式 `school-major-year`
- `school`：学校名称
- `major`：专业名称
- `year`：年份
- `applicants`：报名人数；未知时写 `null`
- `admitted`：录取人数；未知时写 `null`
- `retestCount`：进入复试人数；未知时写 `null`
- `retestLine`：复试线；未知时写 `null`
- `lowestAdmittedScore`：最低录取分；未知时写 `null`
- `riskTags`：风险标签数组，可选值应与前端类型保持一致
- `summary`：一句话现实判断
- `sourceNote`：来源备注，必须说明信息来自哪里
- `status`：`todo` / `draft` / `verified`

最小可用标准：
- `school`
- `major`
- `year`
- `summary`
- `sourceNote`

建议上线前补齐：
- `applicants`
- `admitted`
- `retestCount`
- `retestLine`
- `lowestAdmittedScore`
- `riskTags`

## Failure 字段说明
每条 failure 对应一条真实失败经验。

字段：
- `id`：唯一标识，建议格式 `programId-index`
- `programId`：必须对应某个 program
- `school`：学校名称
- `major`：专业名称
- `year`：年份
- `attempt`：`一战`、`二战` 或 `未知`
- `scoreRange`：分数段，如 `370-379`；未知可写 `待补充`
- `enteredRetest`：是否进入复试
- `finalResult`：前端支持值之一
- `failureStage`：前端支持值之一
- `failureTags`：失败标签数组
- `reminder`：一句提醒
- `review`：失败复盘
- `retryChoice`：如果重来一次
- `advice`：给后来者的建议
- `sourceType`：如 `公开整理`、`官方公示整理`、`匿名投稿`、`人工访谈整理`
- `status`：`todo` / `draft` / `verified`

最小可用标准：
- `programId`
- `school`
- `major`
- `year`
- `finalResult`
- `failureStage`
- `review`
- `sourceType`

## 来源要求
允许来源：
- 招生官网公开信息
- 公开经验帖/复盘帖
- 真实匿名投稿
- 人工访谈后整理的匿名记录

不要直接上线的来源：
- 记忆模糊的二手转述
- 无法确认学校/专业/年份的片段
- 只带情绪、没有事实支撑的吐槽
- 可识别个人隐私内容

## 状态约定
- `todo`：只占坑，还没开始填
- `draft`：已填部分字段，但还未核对
- `verified`：来源清楚，字段可用于下一步处理

## 当前目标
首批目标是：
- 3 个 program
- 9 条 failure
- 每个 program 至少 3 条 failure

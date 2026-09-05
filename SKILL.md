---
name: paper-master
description: 论文全知者——精读/问答/跨篇综合/领域探索四模式共用一个 skill。触发场景（白名单）：用户给出论文 URL（arXiv/PDF 链接）或本地 PDF/markdown 路径要求精读；就已入库论文的内容提问；要求跨论文对比、共性归纳、横评综合；指定 topic 或领域要求探索成图；用户显式说「用 paper-master」「精读这篇」「续读」等。不触发：与具体论文无关的学术闲聊、写作润色、通用问答。
---

# Paper-Master

个人论文知识库的全知接口：读过的一切可查询综合，任意论文可任意粒度问答，未知领域可探索成图。四个模式共用一个 skill，由入口参数路由。

**数据落位**：`~/.claude/paper-master/`（首次使用时创建）

```
~/.claude/paper-master/
├── <slug>/              # 一篇论文一夹
│   ├── paper.md         # 全文 markdown
│   ├── card.md          # 论文卡片（机器查询面）
│   ├── citations/       # 关键引文（精读）
│   ├── plan.md          # 阅读计划（精读）
│   └── archive.md       # 阅读档案（精读终考后）
├── learning-log.md      # 全局学习履历，append-only
├── syntheses/           # 跨篇综合（可选）
└── explorations/        # 领域地图
```

文件模板与 slug 规则见 [FORMATS.md](FORMATS.md)。领域词汇见 [CONTEXT.md](CONTEXT.md)。

**讲解语言**：中文；术语、公式、变量名保留英文原文。

**提问选型**：AskUserQuestion 按选项性质选型——互斥取一（如闸门的继续/跳过/再深入）用单选；多项可同时成立（如摸底自评、批改计划时勾选多个节点）用 multiSelect 多选。

## 路由

解析入口信号（用户消息中携带的 URL/路径/自然语言，或显式调用意图），按以下规则选模式（流程细节见 `references/` 对应文件）：

| 信号 | 模式 | 参考 |
|---|---|---|
| 自然语言含问题（「数据用的什么」「第3节什么意思」） | 问答 | [references/ask.md](references/ask.md) |
| 提多篇 / 共性 / 对比 / 横评 / 「读过论文的共同点」 | 跨篇 | [references/cross-read.md](references/cross-read.md) |
| 给 topic / 领域 / 「探索 X」「这个方向有哪些工作」 | 探索 | [references/explore.md](references/explore.md) |
| 裸 URL / 本地 PDF·markdown 路径 | 先 fetch，再按文档类型分（见下） | — |
| 无参数 | 续读精读 | [references/deep-read.md](references/deep-read.md) §续读 |

**裸 URL/路径 fetch 后的分派**：
- 单篇研究论文 → **精读**（默认，老用法零成本）
- 综述 / survey → 问一句：「精读它，还是当探索某领域的地图？」
- 非论文（博客、新闻）→ 提示用 /read

**续读**：扫描数据目录中 `plan.md` 状态非「已终考」的论文，列出供用户选择，载入进度从断点继续（deep-read 第 6 步）。

**模式互转**：会话中用户改意图即切换——「精读这篇」→ deep-read；「这几篇有什么共性」→ cross-read；「这个领域还有什么」→ explore。

## 共用约定

### 论文卡片（card.md）

每篇入库论文一张卡片，Claude 从 `paper.md` 提取，不依赖用户复述。字段见 FORMATS.md。

- **精读**终考 → 完整卡片，深度标「精读」
- **问答** fetch → 也产卡片，标「浅读」；浅读兼作待精读候选池
- **懒回填**：任何模式碰到无卡论文，先补卡再干活

`card.md` 是机器查询面；`archive.md` 是用户理解快照；`learning-log.md` 管概念粒度，卡片管论文粒度。

### 抓取

**软依赖检测**：若 `~/.claude/skills/web-search/` 存在，优先用其脚本：
- `bun ~/.claude/skills/web-search/fetch.ts <URL> <输出.md>`
- 探索检索用 `search.ts`（见 explore.md 降级链）

否则用内置保底脚本（冻结，不再加功能）：
- `bun <本skill目录>/scripts/fetch-paper.ts <URL|本地PDF路径> <输出.md>`
- 内置级联：arXiv 官方 HTML → ar5iv → PDF（unpdf 解析），Readability 抽网页，jina/defuddle 代理兜底
- 脚本挂了再退 WebFetch。本地 markdown 直接拷入。

精读第 2 步抓关键引文同用上述抓取链。

### 准入

全都进库，带深度标记。探索地图里提到的论文不自动建卡。

### 四模式一览

| 模式 | 本质 | 闭环/标准 | 产物 |
|---|---|---|---|
| 精读 | 教学闭环 | 终考复述通过 | archive.md + 精读卡片 |
| 问答 | 硬 grounding 问答 | 答案引原文；没写就说 | 浅读卡片 |
| 跨篇 | 作用域内综合 | 声明深浅；结论标来源 | 可选 syntheses/ |
| 探索 | 向外成图 | 有据引源，无据标未验证 | explorations/ |

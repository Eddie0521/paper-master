<p align="right">
  <a href="README_EN.md">🇬🇧 English</a>
</p>

# Paper-Reader

> 论文全知者 Claude Code skill——精读、问答、跨篇综合、领域探索，统一管理。

## 四模式

| 模式 | 触发示例 | 产物 |
|------|---------|------|
| **精读** | `/paper-master https://arxiv.org/abs/...` | 阅读档案 + 精读卡片 |
| **问答** | `/paper-master 这篇的数据集是什么` | 浅读卡片（硬 grounding 回答） |
| **跨篇** | `/paper-master 我读过的多 agent WM 有什么共性` | 可选 `syntheses/` |
| **探索** | `/paper-master 探索 world model 记忆机制` | `explorations/` 领域地图 |

## 特性

- **论文卡片** — 每篇入库自动产 `card.md`，跨篇/问答的查询面；精读标「精读」，问答标「浅读」
- **精读教学闭环** — 三层骨架，摸底、检验、终考复述（见 `references/deep-read.md`）
- **复用搜索Skill** — 复用好用的web-search skill，内置`fetch-paper.ts`保底

## 安装

```bash
npx skills add Eddie0521/paper-master
```

### 需要 bun

抓取脚本 `scripts/fetch-paper.ts` 用 [bun](https://bun.sh) 运行。没装 bun 时，问答/跨篇/续读仍可用，但 URL 抓取退化为不稳定的 WebFetch。

```bash
curl -fsSL https://bun.sh/install | bash
```

macOS 也可用 Homebrew：`brew install oven-sh/bun/bun`

## 使用

```
/paper-master https://arxiv.org/abs/2501.12948        # 精读（默认）
/paper-master ~/papers/attention.pdf                  # 本地 PDF
/paper-master MultiWorld 的 MACM 模块怎么工作的       # 问答
/paper-master 我读过的 world model 论文有什么共性     # 跨篇
/paper-master 探索 multi-agent video world model    # 探索
/paper-master                                         # 续读未终考的精读
```

## 数据落位

```
~/.claude/paper-master/
├── <slug>/
│   ├── paper.md       # 全文
│   ├── card.md        # 论文卡片（机器查询面）
│   ├── plan.md        # 阅读计划（精读）
│   ├── archive.md     # 阅读档案（精读终考后）
│   └── citations/     # 关键引文
├── learning-log.md    # 概念履历
├── syntheses/         # 跨篇综合（可选）
└── explorations/      # 领域地图
```

## 仓库结构

| 文件 | 说明 |
|------|------|
| `SKILL.md` | 路由 + 共用约定 |
| `references/` | 四模式流程（deep-read / ask / cross-read / explore） |
| `FORMATS.md` | 文件模板 |
| `scripts/fetch-paper.ts` | 内置抓取脚本（保底） |
| `sync.sh` | 分发到 skills 安装位 |
| `CONTEXT.md` | 领域词汇表（设计文档，不随分发） |

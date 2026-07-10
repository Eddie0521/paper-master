<p align="right">
  <a href="README_EN.md">🇬🇧 English</a>
</p>

# Paper-Reader

> 渐进式精读一篇论文的 Claude Code skill——摸底、阅读计划、按层讲解、终考复述，产出费曼档案。

目的地是**精读掌握**：会话结束时，你能用自己的话复述论文的动机、方法与证据链，能回答"为什么这么设计"级别的问题。讲完不等于读完，复述通过才算。

## 特性

- **三层骨架** — 前置概念 → 领域格局 → 本文，由外向内推进
- **摸底防冗余** — 开讲前勾选你已会的概念，不把会的再讲一遍；讲解中发现缺口即时**下潜**补讲
- **阅读计划即导航图** — 每节点标 详/略/跳过，进度落盘，跨会话断点续读
- **检验与终考** — 每层 1-2 道开放综合题；全文结束用自己的话复述 动机 → 方法 → 证据链
- **费曼档案** — 复述原文 + 漏洞清单 + 关键问答归档；学习履历跨论文累积，越读越省
- **独立抓取脚本** — unpdf 解析 PDF（绕开 WebFetch 大 PDF 栈溢出），arXiv 自动按 官方HTML → ar5iv → PDF 择优，Readability 抽取网页，jina/defuddle 代理兜底

## 安装

```bash
npx skills add Eddie0521/paper-reader
```

需要 [bun](https://bun.sh)（抓取脚本的运行时；首次运行自动装依赖，需联网）。仓库为 private，安装的机器上需有 GitHub 访问凭证。

本地开发：克隆本仓库改动后，跑 `./sync.sh` 直接分发到 `~/.claude/skills/`（Claude Code）与 `~/.agents/skills/`（其他兼容 skills 目录的 agent）。

## 使用

```
/paper-reader https://arxiv.org/abs/2501.12948   # URL 开新精读
/paper-reader ~/papers/attention.pdf             # 本地 PDF
/paper-reader                                    # 无参数：列出未读完的论文，断点续读
```

## 流程

| # | 步骤 | 做什么 |
|---|------|--------|
| 1 | 吸收 | 抓全文转 markdown，通读 |
| 2 | 关键引文 | 挑 2-4 篇直接前驱 / baseline / benchmark 原文抓取 |
| 3 | 摸底 | 按三层列节点，勾选已会的前置概念 |
| 4 | 阅读计划 | 每节点标 详/略/跳过，用户批改后开讲 |
| 5 | 速览 | 讲清主张什么、为什么重要、接的哪段话 |
| 6 | 按层推进 | 例子 + 图示 + 连接旧知识；节点闸门控节奏，每层检验 |
| 7 | 终考 | 复述 动机 → 方法 → 证据链，对照原文指漏洞 |
| 8 | 归档 | 费曼档案 + 学习履历追加 |

## 数据落位

```
~/.claude/paper-reader/
├── <slug>/            # 一篇论文一夹
│   ├── paper.md       # 全文 markdown
│   ├── citations/     # 关键引文
│   ├── plan.md        # 阅读计划 + 进度（断点续读的锚）
│   └── archive.md     # 费曼档案
└── learning-log.md    # 全局学习履历，append-only
```

## 抓取脚本单独用

```bash
bun scripts/fetch-paper.ts <URL|本地PDF路径> [输出.md]
```

省略输出路径则正文打印到 stdout，来源与统计走 stderr。arXiv 的 abs/pdf/html 任意链接形式都会自动换到最优全文源；单文件零 node_modules，拷到哪都能跑。

## 仓库结构

| 文件 | 说明 |
|------|------|
| `SKILL.md` | skill 入口：流程与规则 |
| `FORMATS.md` | plan / archive / learning-log 的文件模板 |
| `scripts/fetch-paper.ts` | 独立抓取脚本（单文件） |
| `sync.sh` | 分发到两个 skills 安装位 |
| `CONTEXT.md` | 领域词汇表（设计文档，不随分发） |

本仓库是唯一事实源：改这里，跑 `./sync.sh` 分发；别直接改安装位的拷贝。

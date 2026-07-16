# 文件模板

## slug

论文标题的 kebab-case 短形式，3-5 个词："Tree of Thoughts: Deliberate Problem Solving with Large Language Models" → `tree-of-thoughts`。

## plan.md

```markdown
# <论文标题>

- 来源: <URL 或路径>
- 状态: 进行中 | 已终考
- 开始: 2026-07-10

## 前置概念
- [x] KL regularization — 略（履历 2026-06-01 学过）
- [>] rejection sampling — 详
- [~] PPO — 跳过（自评会）

检验: 通过（复讲了 importance sampling）

## 领域格局
- [ ] RLHF 主线: InstructGPT → DPO → 本文 — 详
- [ ] AlpacaEval 评价协议 — 略

## 本文
- [ ] 方法: 目标函数与训练流程 — 详
- [ ] 实验: 主结果与消融 — 详
- [ ] 局限与开放问题 — 略
```

标记：`[ ]` 未讲，`[>]` 进行中，`[x]` 已讲，`[~]` 跳过。每层末尾一行检验结果。下潜补讲的概念追加进前置概念层，理由写"下潜补讲"。

## archive.md

```markdown
# 阅读档案: <论文标题>

- 日期: 2026-07-10
- 来源: <URL 或路径>

## 我的复述

<用户原话，尽量少编辑>

## 漏洞与含糊处

- <Claude 指出的每一处>

## 关键问答

- Q: <会话中有价值的提问> — A 要点: <一两句>

## 最终计划快照

<plan.md 终态拷贝>
```

## card.md

论文卡片，机器查询面。从 `paper.md` 提取，不依赖用户复述。

```markdown
# <论文标题>

- 来源: <URL 或路径>
- 深度: 精读 | 浅读
- 更新: 2026-07-10

## 问题

<这篇解决什么，1-3 句>

## 方法

<核心做法，含关键模块名>

## 数据与实验

<数据集、基准、评价协议；关键数字>

## 主结论

<含关键数字的主要发现>

## 局限

<作者承认或显而易见的限制>

## 关键词

<逗号分隔，供跨篇匹配>
```

深度规则：精读终考 →「精读」；问答 fetch →「浅读」；浅读卡片被精读终考后升级为精读并补全。

## learning-log.md

一行一概念，append-only：

```markdown
- 2026-07-10 | tree-of-thoughts | rejection sampling — 采样后按条件筛留的通用技巧
```

## syntheses/

跨篇综合可选落盘。文件名：主题 kebab-case，如 `multi-agent-wm-methods.md`。

```markdown
# 综合: <主题>

- 日期: 2026-07-10
- 语料: <slug 列表>
- 深浅: 精读 N 篇，浅读 M 篇

## <章节标题>

<结论，每条标注来源 `<slug>` + 字段/段落>
```

## explorations/

领域地图。文件名：topic kebab-case，如 `multi-agent-world-models.md`。

```markdown
# 领域地图: <topic>

- 日期: 2026-07-10
- 检索: web-search | WebSearch | 模型知识（未验证）

## 领域定义

<边界与核心问题>

## 方法流派

| 流派 | 代表论文 | 要点 |
|------|---------|------|
| ... | [标题](URL) | ... |

## 数据与评价惯例

<有据引源；无据标未验证>

## 开放问题

## 与已读论文的连接

- `<slug>` — <关联说明>
```

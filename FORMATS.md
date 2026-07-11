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

## learning-log.md

一行一概念，append-only：

```markdown
- 2026-07-10 | tree-of-thoughts | rejection sampling — 采样后按条件筛留的通用技巧
```

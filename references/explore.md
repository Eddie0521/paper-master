# 探索

目的地是**向外成图**：用户给一个 topic/领域，检索相关论文与脉络，产出领域地图；具体声明落在抓到的源上，抓不到标「未验证」。

## 1. 明确探索范围

从用户输入提取 topic、深度预期（概览 / 深挖某子方向）、是否限定时间窗或子领域。模糊时问一句收窄。

## 2. 检索（降级链）

按优先级尝试，某级不可用则降下一级：

1. **web-search skill** — 检测 `~/.claude/skills/web-search/` 存在则调用其 CLI：
   - `bun ~/.claude/skills/web-search/search.ts "<query>"`
   - 论文类查询优先走其 arXiv provider
   - 抓到全文：`bun ~/.claude/skills/web-search/fetch.ts <url> [输出.md]`
2. **宿主 WebSearch** — web-search 不可用且环境提供 WebSearch 工具时使用
3. **模型知识兜底** — 以上皆不可用；每条信息标「未验证」，不冒充已抓取

探索提到的论文**不自动建卡**——只有用户后续 fetch/问答/精读时才入库。

## 3. 抓取关键源

从检索结果挑 3-8 篇代表性论文（奠基、综述、最新进展），对重要条目 fetch 摘要或全文：
- 有 web-search → 用其 fetch
- 否则 → `bun <本skill目录>/scripts/fetch-paper.ts <URL> <临时路径>` 或 WebFetch
- 抓取失败保留标题+摘要链接，标「未验证」

## 4. 写领域地图

产出 `explorations/<topic-kebab>.md`（模板见 FORMATS.md），含：
- 领域定义与边界
- 主要问题轴 / 方法流派（附代表论文与链接）
- 数据与评价惯例（有据则引，无则标未验证）
- 开放问题与时间线
- 与用户已读论文的连接（扫 `card.md` 标题/关键词，有相关则链到 `<slug>`）

## 5. 后续衔接

- 用户说「精读这篇」+ URL → 路由到 `references/deep-read.md`
- 用户追问地图中某篇细节 → 路由到 `references/ask.md`（需先 fetch 入库）
- 用户要跨地图内多篇对比 → 路由到 `references/cross-read.md`

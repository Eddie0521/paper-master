<p align="right">
  <a href="README.md">🇨🇳 中文</a>
</p>

# Paper-Reader

> An omniscient paper Claude Code skill — deep read, Q&A, cross-paper synthesis, and domain exploration, all in one place.

## Four modes

| Mode | Example trigger | Output |
|------|----------------|--------|
| **Deep read** | `/paper-master https://arxiv.org/abs/...` | Reading archive + deep-read card |
| **Ask** | `/paper-master what dataset does this paper use` | Shallow card (hard-grounded answers) |
| **Cross-read** | `/paper-master what do my multi-agent WM papers have in common` | Optional `syntheses/` |
| **Explore** | `/paper-master explore world model memory mechanisms` | `explorations/` domain map |

## Features

- **Paper cards** — every ingested paper auto-generates `card.md` as the query surface for cross-read and ask; deep read → "精读", ask → "浅读"
- **Deep-read teaching loop** — three-layer skeleton, calibration, checks, final recital (see `references/deep-read.md`)
- **Reuses web-search skill** — leverages the web-search skill when available; built-in `fetch-paper.ts` as fallback

## Install

```bash
npx skills add Eddie0521/paper-master
```

### Requires bun

The fetch script `scripts/fetch-paper.ts` runs on [bun](https://bun.sh). Without bun, ask / cross-read / resume still work, but URL fetching falls back to flaky WebFetch.

```bash
curl -fsSL https://bun.sh/install | bash
```

On macOS you can also use Homebrew: `brew install oven-sh/bun/bun`

## Usage

```
/paper-master https://arxiv.org/abs/2501.12948        # deep read (default)
/paper-master ~/papers/attention.pdf                  # local PDF
/paper-master how does MultiWorld's MACM module work  # ask
/paper-master common themes in my world model papers  # cross-read
/paper-master explore multi-agent video world models  # explore
/paper-master                                         # resume unfinished deep read
```

## Data layout

```
~/.claude/paper-master/
├── <slug>/
│   ├── paper.md       # full text
│   ├── card.md        # paper card (machine query surface)
│   ├── plan.md        # reading plan (deep read)
│   ├── archive.md     # reading archive (after recital)
│   └── citations/     # key citations
├── learning-log.md    # concept log
├── syntheses/         # cross-read outputs (optional)
└── explorations/      # domain maps
```

## Repo structure

| File | Purpose |
|------|---------|
| `SKILL.md` | Routing + shared conventions |
| `references/` | Four mode flows (deep-read / ask / cross-read / explore) |
| `FORMATS.md` | File templates |
| `scripts/fetch-paper.ts` | Built-in fetch script (fallback) |
| `sync.sh` | Distributes to skills install locations |
| `CONTEXT.md` | Domain vocabulary (design doc, not distributed) |

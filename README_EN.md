<p align="right">
  <a href="README.md">🇨🇳 中文</a>
</p>

# Paper-Reader

> A Claude Code skill for progressively deep-reading one paper — calibration, reading plan, layer-by-layer teaching, final recital, and a reading archive.

The destination is **mastery**: by the end, you can restate the paper's motivation, method, and chain of evidence in your own words, and answer "why was it designed this way" questions. Finishing the lecture is not finishing the read — only a passing recital counts.

## Features

- **Three-layer skeleton** — Prerequisites → Landscape → The Paper, taught outside-in
- **Calibration against redundancy** — check off concepts you already know before teaching starts; gaps found mid-lecture trigger an on-the-spot **dive**
- **Reading plan as the map** — every node marked detailed / brief / skip, progress persisted on disk, resumable across sessions
- **Checks and the recital** — 1-2 open-ended questions per layer; at the end you restate motivation → method → evidence in your own words
- **Reading archive** — your recital + the holes found in it + key Q&A, archived; a learning log accumulates across papers so each read gets cheaper
- **Standalone fetch script** — unpdf for PDFs (sidesteps WebFetch's stack overflow on large PDFs), arXiv source selection (official HTML → ar5iv → PDF), Readability for web pages, jina/defuddle proxy fallback

## Install

```bash
npx skills add Eddie0521/paper-reader
```

Requires [bun](https://bun.sh) (runtime for the fetch script; first run auto-installs dependencies, needs network). The repo is private — the installing machine needs GitHub credentials.

Local development: clone this repo, make changes, then run `./sync.sh` to distribute directly to `~/.claude/skills/` (Claude Code) and `~/.agents/skills/` (other agents reading the shared skills directory).

## Usage

```
/paper-reader https://arxiv.org/abs/2501.12948   # start a new deep read from a URL
/paper-reader ~/papers/attention.pdf             # local PDF
/paper-reader                                    # no args: list unfinished papers, resume
```

## How it works

| # | Step | What happens |
|---|------|--------------|
| 1 | Absorb | Fetch full text as markdown, read it through |
| 2 | Key citations | Pick 2-4: direct predecessor / main baseline / benchmark paper, fetch each |
| 3 | Calibration | List nodes across three layers, check off prerequisites you already know |
| 4 | Reading plan | Mark each node detailed / brief / skip; you edit, then teaching starts |
| 5 | Orientation | What the paper claims, why it matters, which conversation it joins |
| 6 | Layer by layer | Examples + diagrams + links to prior knowledge; gates control pace, each layer ends with a check |
| 7 | Recital | Restate motivation → method → evidence; holes pointed out against the source |
| 8 | Archive | Reading archive + learning-log append |

## Data layout

```
~/.claude/paper-reader/
├── <slug>/            # one folder per paper
│   ├── paper.md       # full text as markdown
│   ├── citations/     # key citations
│   ├── plan.md        # reading plan + progress (the resume anchor)
│   └── archive.md     # reading archive
└── learning-log.md    # global learning log, append-only
```

## Using the fetch script standalone

```bash
bun scripts/fetch-paper.ts <URL|local-PDF-path> [output.md]
```

Without an output path the body goes to stdout; source and stats go to stderr. Any arXiv link form (abs/pdf/html) is normalized to the best full-text source. Single file, zero node_modules — runs from anywhere.

## Repo structure

| File | Purpose |
|------|---------|
| `SKILL.md` | Skill entry: flow and rules |
| `FORMATS.md` | File templates for plan / archive / learning-log |
| `scripts/fetch-paper.ts` | Standalone fetch script (single file) |
| `sync.sh` | Distributes to both skills install locations |
| `CONTEXT.md` | Domain vocabulary (design doc, not distributed) |

This repo is the single source of truth: edit here, run `./sync.sh` to distribute; don't edit the installed copies.

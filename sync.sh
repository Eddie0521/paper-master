#!/usr/bin/env bash
# 把 skill 同步到 Claude Code 与 .agents 的 skills 目录。
# 仓库是唯一事实源：改这里，跑 ./sync.sh 分发。
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"

for DEST in "$HOME/.claude/skills/paper-master" "$HOME/.agents/skills/paper-master"; do
  mkdir -p "$DEST/scripts" "$DEST/references"
  cp "$SRC/SKILL.md" "$SRC/FORMATS.md" "$DEST/"
  cp "$SRC/references/"*.md "$DEST/references/"
  cp "$SRC/scripts/fetch-paper.ts" "$DEST/scripts/"
  echo "✓ $DEST"
done

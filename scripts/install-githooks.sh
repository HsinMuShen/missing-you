#!/usr/bin/env sh
set -eu

if [ ! -d .git ]; then
  echo "[hooks] .git directory not found. Run this from repository root." >&2
  exit 1
fi

mkdir -p .git/hooks
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "[hooks] Installed pre-commit hook"

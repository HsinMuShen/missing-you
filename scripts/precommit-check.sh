#!/usr/bin/env sh
set -eu

echo "[pre-commit] Running shared build"
pnpm --filter @missing-you/shared build

echo "[pre-commit] Running web lint"
pnpm --filter @missing-you/web lint

echo "[pre-commit] Running web tests"
pnpm --filter @missing-you/web test:run

echo "[pre-commit] Running web production build"
pnpm --filter @missing-you/web build

if command -v forge >/dev/null 2>&1; then
  echo "[pre-commit] Running contract tests"
  pnpm --filter @missing-you/contracts test
else
  echo "[pre-commit] forge not found; skipping contract tests"
fi

echo "[pre-commit] All required checks passed"

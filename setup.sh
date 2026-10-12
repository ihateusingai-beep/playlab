#!/usr/bin/env bash
# PlayLab one-shot setup. Idempotent: safe to re-run.
# Run from anywhere; absolute paths used inside.

set -euo pipefail

PROJECT_DIR="$HOME/workspace/playlab"
OLD_HUB="$HOME/workspace/vs code/Innovative Teaching Prompt Studio/game-hub"

echo "== PlayLab setup =="
echo "Project: $PROJECT_DIR"
echo

# 1) Remove the old single-file game-hub (we are replacing it).
if [ -d "$OLD_HUB" ]; then
  echo "[1/6] Removing old game-hub at $OLD_HUB"
  rm -rf "$OLD_HUB"
else
  echo "[1/6] Old game-hub not present (skipped)"
fi

# 2) Ensure the project directory exists.
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 3) Install dependencies.
echo "[2/6] Installing dependencies (this may take a minute)"
npm install

# 4) Type-check + build to verify everything is wired.
echo "[3/6] Type-check + build"
npm run build

# 5) Initialize git if needed and commit.
if [ ! -d ".git" ]; then
  echo "[4/6] Initializing git"
  git init -b main >/dev/null
  git add -A
  git -c user.email=kencheng@users.noreply.github.com \
      -c user.name=kencheng \
      commit -m "feat: scaffold PlayLab (Vite + React + TS)" >/dev/null
  echo "    initial commit created"
else
  echo "[4/6] git already initialized (skipped)"
  # If the tree is dirty, commit what is new.
  if [ -n "$(git status --porcelain 2>/dev/null || true)" ]; then
    git add -A
    git -c user.email=kencheng@users.noreply.github.com \
        -c user.name=kencheng \
        commit -m "feat: scaffold PlayLab (Vite + React + TS)" >/dev/null || true
    echo "    pending changes committed"
  fi
fi

# 6) Create the GitHub repo and push (if gh is configured).
if command -v gh >/dev/null 2>&1; then
  if gh repo view ihateusingai-beep/playlab >/dev/null 2>&1; then
    echo "[5/6] Repo ihateusingai-beep/playlab already exists"
  else
    echo "[5/6] Creating GitHub repo ihateusingai-beep/playlab"
    gh repo create ihateusingai-beep/playlab --public --source=. --remote=origin --push \
      --description "PlayLab — interactive educational games platform" || \
      gh repo create ihateusingai-beep/playlab --public --source=. --remote=origin
    git push -u origin main || true
  fi
  echo "[6/6] Pushing to origin"
  git push -u origin main
else
  echo "[5/6] gh CLI not found — create the repo manually, then run:"
  echo "       git remote add origin https://github.com/ihateusingai-beep/playlab.git"
  echo "       git push -u origin main"
fi

echo
echo "== Done =="
echo "Dev:    cd $PROJECT_DIR && npm run dev"
echo "Build:  cd $PROJECT_DIR && npm run build"
echo "Site:   https://ihateusingai-beep.github.io/playlab/  (after Pages is enabled)"

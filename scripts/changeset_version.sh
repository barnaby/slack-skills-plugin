#!/usr/bin/env bash
set -euo pipefail

npx changeset version
# Keep the committed lockfile's version field in sync with the bumped package.json.
npm install --package-lock-only
python scripts/sync_versions.py

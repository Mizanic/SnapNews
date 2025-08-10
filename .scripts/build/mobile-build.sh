#!/bin/bash

export NODE_ENV=development

set -euo pipefail

# Absolute project root for WSL-friendly paths
PROJECT_ROOT="/home/rehan/SnapNews"
MOBILE_DIR="$PROJECT_ROOT/mobile"
ANDROID_DIR="$PROJECT_ROOT/mobile/android"
APP_JSON_FILE="$MOBILE_DIR/app.json"

today=$(date +%Y%m%d)

# Read current version from app.json
if [ -f "$APP_JSON_FILE" ]; then
  current_version=$(grep '"version":' "$APP_JSON_FILE" | sed 's/.*"version": *"\([^"]*\)".*/\1/')
else
  current_version="0"
fi

# Parse current version to find an optional YYYYMMDD and patch suffix
# Expected final format: <base>.<YYYYMMDD>.<patch>
base="$current_version"
prev_date=""
prev_patch=""
if [[ "$current_version" =~ ^(.+)\.([0-9]{8})(\.([0-9]+))?$ ]]; then
  base="${BASH_REMATCH[1]}"
  prev_date="${BASH_REMATCH[2]}"
  prev_patch="${BASH_REMATCH[4]}"
fi

# Ensure base has no trailing dot
base="${base%.}"

# Decide new patch
if [[ "$prev_date" == "$today" ]]; then
  # Continue incrementing for the same day
  p=${prev_patch:-0}
  new_patch=$((p + 1))
else
  # New day (or no existing date) resets patch to 1
  new_patch=1
fi

new_version="${base}.${today}.${new_patch}"

# Write back to app.json
sed -i "s/\"version\": *\"[^\"]*\"/\"version\": \"${new_version}\"/" "$APP_JSON_FILE"

echo "Updated app.json version: $current_version -> $new_version"

cd "$MOBILE_DIR" && npx expo prebuild --no-install
cd "$ANDROID_DIR" &&  ./gradlew assembleRelease
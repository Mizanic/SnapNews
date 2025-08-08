#!/bin/bash

export NODE_ENV=development

set -euo pipefail

# Absolute project root for WSL-friendly paths
PROJECT_ROOT="/home/rehan/SnapNews"
ANDROID_DIR="$PROJECT_ROOT/mobile/android"
GRADLE_PROPS_FILE="$ANDROID_DIR/gradle.properties"

today=$(date +%Y%m%d)

# Read current value or default to base "0"
if grep -q '^android.versionName=' "$GRADLE_PROPS_FILE"; then
  current_version=$(grep '^android.versionName=' "$GRADLE_PROPS_FILE" | cut -d'=' -f2)
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

# Write back to gradle.properties
if grep -q '^android.versionName=' "$GRADLE_PROPS_FILE"; then
  sed -i "s/^android.versionName=.*/android.versionName=${new_version}/" "$GRADLE_PROPS_FILE"
else
  echo "android.versionName=${new_version}" >> "$GRADLE_PROPS_FILE"
fi

echo "Computed android.versionName: $current_version -> $new_version"

cd "$ANDROID_DIR" && ./gradlew assembleRelease
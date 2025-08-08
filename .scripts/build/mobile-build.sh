#!/bin/bash

export NODE_ENV=development

set -euo pipefail

# Absolute project root for WSL-friendly paths
PROJECT_ROOT="/home/rehan/SnapNews"
ANDROID_DIR="$PROJECT_ROOT/mobile/android"
GRADLE_PROPS_FILE="$ANDROID_DIR/gradle.properties"

# Bump the patch version of android.versionName (format: x.y.z where y can be date-like)
if grep -q '^android.versionName=' "$GRADLE_PROPS_FILE"; then
  current_version=$(grep '^android.versionName=' "$GRADLE_PROPS_FILE" | cut -d'=' -f2)
  IFS='.' read -r part1 part2 part3 <<< "$current_version"
  if [[ -z "${part3:-}" ]]; then
    # If no patch part, default to 0
    part3=0
  fi
  new_patch=$((part3 + 1))
  new_version="${part1}.${part2}.${new_patch}"
  # In-place update (portable for GNU sed on Linux)
  sed -i "s/^android.versionName=.*/android.versionName=${new_version}/" "$GRADLE_PROPS_FILE"
  echo "Bumped android.versionName: $current_version -> $new_version"
else
  echo "android.versionName not found in $GRADLE_PROPS_FILE; adding default 0.0.1"
  echo "android.versionName=0.0.1" >> "$GRADLE_PROPS_FILE"
fi

cd "$ANDROID_DIR" && ./gradlew assembleRelease
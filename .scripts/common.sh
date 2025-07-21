#!/bin/bash

# ===============================
# SnapNews Common Utilities
# ===============================
# Source this file in other scripts: source "$(dirname "$0")/common.sh"

# --- Colors ---
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[1;33m'
export BLUE='\033[0;34m'
export PURPLE='\033[0;35m'
export CYAN='\033[0;36m'
export NC='\033[0m' # No Color

# --- Configuration ---
export SNAPNEWS_PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export SNAPNEWS_SCRIPTS_DIR="${SNAPNEWS_PROJECT_ROOT}/.scripts"
export SNAPNEWS_BACKEND_DIR="${SNAPNEWS_PROJECT_ROOT}/backend"
export SNAPNEWS_CONFIG_FILE="${SNAPNEWS_PROJECT_ROOT}/config.json"

# --- Logging Functions ---
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}" >&2
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}" >&2
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" >&2
}

log_error() {
    echo -e "${RED}❌ $1${NC}" >&2
}

log_debug() {
    [[ "${SNAPNEWS_DEBUG:-}" == "1" ]] && echo -e "${PURPLE}🐛 $1${NC}" >&2
}

fatal() {
    log_error "$1"
    exit "${2:-1}"
}

# --- Progress indicators ---
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while ps -p "$pid" > /dev/null 2>&1; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# --- Dependency checking ---
check_dependency() {
    local cmd="$1"
    local pkg="${2:-$1}"
    
    if ! command -v "$cmd" >/dev/null 2>&1; then
        fatal "Missing dependency: $pkg. Please install it first."
    fi
}

check_dependencies() {
    local deps=("$@")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            missing+=("$dep")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        fatal "Missing dependencies: ${missing[*]}"
    fi
}

# --- File operations ---
ensure_file_exists() {
    local file="$1"
    [[ -f "$file" ]] || fatal "Required file not found: $file"
}

ensure_dir_exists() {
    local dir="$1"
    [[ -d "$dir" ]] || fatal "Required directory not found: $dir"
}

# --- AWS helpers ---
check_aws_credentials() {
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        fatal "AWS credentials not configured. Run 'aws configure' first."
    fi
}

get_aws_region() {
    aws configure get region || echo "us-east-1"
}

# --- JSON helpers ---
validate_json() {
    local file="$1"
    if ! jq . "$file" >/dev/null 2>&1; then
        fatal "Invalid JSON in file: $file"
    fi
}

# --- Project helpers ---
get_project_config() {
    local key="$1"
    local default="${2:-}"
    
    if [[ -f "$SNAPNEWS_CONFIG_FILE" ]]; then
        jq -r ".$key // \"$default\"" "$SNAPNEWS_CONFIG_FILE" 2>/dev/null || echo "$default"
    else
        echo "$default"
    fi
}

# --- Script metadata ---
show_script_header() {
    local script_name="$1"
    local description="$2"
    
    echo -e "${CYAN}======================================${NC}"
    echo -e "${CYAN}SnapNews: $script_name${NC}"
    echo -e "${CYAN}======================================${NC}"
    [[ -n "$description" ]] && echo -e "${BLUE}$description${NC}"
    echo
}

# --- Cleanup helpers ---
cleanup_temp_files() {
    local pattern="${1:-/tmp/snapnews-*}"
    rm -f $pattern 2>/dev/null || true
}

# --- Exit handlers ---
setup_cleanup() {
    trap 'cleanup_temp_files; log_info "Cleanup completed"' EXIT
    trap 'fatal "Script interrupted"' INT TERM
} 
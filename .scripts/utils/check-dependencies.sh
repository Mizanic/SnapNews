#!/bin/bash

# Source common utilities
source "$(dirname "$0")/../common.sh"

show_script_header "Dependency Checker" "Check system dependencies for SnapNews"
setup_cleanup

# Required system dependencies
REQUIRED_DEPS=(
    "jq:jq"
    "aws:awscli"
    "node:node.js"
    "npm:npm"
    "python3:python3"
    "pip3:python3-pip"
    "git:git"
    "curl:curl"
)

# Optional dependencies
OPTIONAL_DEPS=(
    "docker:docker"
    "terraform:terraform"
    "kubectl:kubectl"
)

check_system_dependency() {
    local cmd="$1"
    local pkg="$2"
    
    if command -v "$cmd" >/dev/null 2>&1; then
        local version=$(get_version "$cmd")
        log_success "$pkg is installed ($version)"
        return 0
    else
        log_error "$pkg is missing (command: $cmd)"
        return 1
    fi
}

get_version() {
    local cmd="$1"
    case "$cmd" in
        jq) jq --version 2>/dev/null || echo "unknown" ;;
        aws) aws --version 2>/dev/null | head -1 || echo "unknown" ;;
        node) node --version 2>/dev/null || echo "unknown" ;;
        npm) npm --version 2>/dev/null || echo "unknown" ;;
        python3) python3 --version 2>/dev/null || echo "unknown" ;;
        pip3) pip3 --version 2>/dev/null | cut -d' ' -f2 || echo "unknown" ;;
        git) git --version 2>/dev/null | cut -d' ' -f3 || echo "unknown" ;;
        docker) docker --version 2>/dev/null | cut -d' ' -f3 | tr -d ',' || echo "unknown" ;;
        *) echo "unknown" ;;
    esac
}

install_suggestions() {
    log_info "Installation suggestions:"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install -y jq awscli nodejs npm python3 python3-pip git curl"
    echo ""
    echo "macOS (with Homebrew):"
    echo "  brew install jq awscli node python3 git curl"
    echo ""
    echo "AWS CLI configuration:"
    echo "  aws configure"
    echo ""
    echo "Node.js packages (run in project directory):"
    echo "  cd admin && npm install"
    echo "  cd mobile && npm install"
}

main() {
    log_info "Checking system dependencies..."
    echo ""
    
    local missing_required=0
    local missing_optional=0
    
    # Check required dependencies
    echo "Required Dependencies:"
    echo "====================="
    for dep in "${REQUIRED_DEPS[@]}"; do
        local cmd="${dep%:*}"
        local pkg="${dep#*:}"
        if ! check_system_dependency "$cmd" "$pkg"; then
            ((missing_required++))
        fi
    done
    
    echo ""
    
    # Check optional dependencies
    echo "Optional Dependencies:"
    echo "====================="
    for dep in "${OPTIONAL_DEPS[@]}"; do
        local cmd="${dep%:*}"
        local pkg="${dep#*:}"
        if ! check_system_dependency "$cmd" "$pkg"; then
            ((missing_optional++))
            log_debug "$pkg is optional but recommended"
        fi
    done
    
    echo ""
    
    # Summary
    if [[ $missing_required -eq 0 ]]; then
        log_success "All required dependencies are installed! ✨"
    else
        log_error "$missing_required required dependencies are missing"
        echo ""
        install_suggestions
        exit 1
    fi
    
    if [[ $missing_optional -gt 0 ]]; then
        log_warning "$missing_optional optional dependencies are missing"
    fi
    
    # Additional checks
    echo ""
    log_info "Additional checks:"
    
    # AWS credentials
    if aws sts get-caller-identity >/dev/null 2>&1; then
        log_success "AWS credentials are configured"
    else
        log_warning "AWS credentials not configured (run 'aws configure')"
    fi
    
    # Node.js project dependencies
    if [[ -f "admin/package.json" ]] && [[ ! -d "admin/node_modules" ]]; then
        log_warning "Admin dependencies not installed (run 'cd admin && npm install')"
    fi
    
    if [[ -f "mobile/package.json" ]] && [[ ! -d "mobile/node_modules" ]]; then
        log_warning "Mobile dependencies not installed (run 'cd mobile && npm install')"
    fi
    
    # Python dependencies
    if [[ -f "requirements.txt" ]]; then
        if ! pip3 list | grep -f requirements.txt >/dev/null 2>&1; then
            log_warning "Python dependencies may not be installed (run 'pip3 install -r requirements.txt')"
        fi
    fi
    
    log_success "Dependency check completed!"
}

main "$@" 
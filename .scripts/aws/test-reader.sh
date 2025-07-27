#!/bin/bash

# ===============================
# SnapNews Lambda Reader Test Script
# ===============================

# Source common utilities
source "$(dirname "$0")/../common.sh"

show_script_header "Lambda Reader Test" "Test AWS Lambda function with news sources"
setup_cleanup

# --- Configuration ---
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly TEST_EVENT_FILE="${SCRIPT_DIR}/../testing/test_event.json"
readonly READER_FUNCTION_NAME="SnapNews-Reader"
readonly RESPONSE_FILE="/tmp/snapnews-reader-response.json"

show_usage() {
    echo "SnapNews Lambda Reader Test"
    echo "=========================="
    echo
    echo "Usage: $0 [source_name|all]"
    echo
    echo "Arguments:"
    echo "  source_name    Test specific news source (e.g., NDTV, TOI)"
    echo "  all           Test all available sources"
    echo
    echo "Available sources:"
    if [[ -f "$TEST_EVENT_FILE" ]]; then
        jq -r '.[].NewsSource' "$TEST_EVENT_FILE" | sort | uniq | sed 's/^/  - /'
    else
        echo "  (test_event.json not found)"
    fi
    echo
    echo "Examples:"
    echo "  $0 NDTV        # Test NDTV source only"
    echo "  $0 all         # Test all sources"
}

validate_dependencies() {
    check_dependencies jq aws
    ensure_file_exists "$TEST_EVENT_FILE"
}

get_available_sources() {
    jq -r '.[].NewsSource' "$TEST_EVENT_FILE" | sort | uniq
}

validate_source() {
    local source="$1"
    
    if [[ "$source" == "all" ]]; then
        return 0
    fi
    
    if ! jq -e --arg source "$source" '.[] | select(.NewsSource == $source)' "$TEST_EVENT_FILE" >/dev/null; then
        fatal "Invalid source: $source"
    fi
}

invoke_lambda() {
    local event="$1"
    local source
    source=$(echo "$event" | jq -r '.NewsSource')
    
    log_info "Testing source: $source"
    echo "Event payload: $event"
    
    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        log_warning "AWS credentials not configured - skipping actual Lambda invocation"
        log_info "To configure AWS: aws configure"
        return 1
    fi
    
    # Check if Lambda function exists
    if ! aws lambda get-function --function-name "$READER_FUNCTION_NAME" >/dev/null 2>&1; then
        log_warning "Lambda function '$READER_FUNCTION_NAME' not found - skipping invocation"
        log_info "Deploy the Lambda function first with: make deploy STACK=Lambda"
        return 1
    fi
    
    log_info "Invoking Lambda function..."
    if aws lambda invoke \
        --function-name "$READER_FUNCTION_NAME" \
        --payload "$event" \
        --cli-binary-format raw-in-base64-out \
        "$RESPONSE_FILE" >/dev/null 2>&1; then
        
        log_success "Lambda invocation successful"
        echo "Response:"
        if jq '.' "$RESPONSE_FILE" 2>/dev/null; then
            # JSON response, check for errors
            if jq -e '.errorMessage or .errorType' "$RESPONSE_FILE" >/dev/null 2>&1; then
                log_warning "Lambda function returned an error for source: $source"
                return 1
            fi
        else
            # Non-JSON response, show raw
            cat "$RESPONSE_FILE"
        fi
        return 0
    else
        log_warning "Lambda invocation failed for source: $source"
        log_info "Check CloudWatch logs for details: make check-errors"
        return 1
    fi
}

cleanup_response_file() {
    [[ -f "$RESPONSE_FILE" ]] && rm -f "$RESPONSE_FILE"
}

main() {
    # Setup cleanup for response file
    trap 'cleanup_response_file; cleanup_temp_files' EXIT
    
    # Validate dependencies
    validate_dependencies
    
    # Parse arguments
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    local source_filter="$1"
    validate_source "$source_filter"
    
    log_info "Starting Lambda Reader tests..."
    echo "Function: $READER_FUNCTION_NAME"
    echo "Filter: $source_filter"
    echo "======================================="
    
    # Get events to test
    local events
    if [[ "$source_filter" == "all" ]]; then
        events=$(jq -c '.[]' "$TEST_EVENT_FILE")
    else
        events=$(jq -c --arg source "$source_filter" '.[] | select(.NewsSource == $source)' "$TEST_EVENT_FILE")
    fi
    
    # Test each event
    local test_count=0
    local success_count=0
    
    while IFS= read -r event; do
        [[ -z "$event" ]] && continue
        
        ((test_count++))
        echo
        echo "Test $test_count:"
        echo "---------------"
        
        if invoke_lambda "$event"; then
            ((success_count++))
        fi
        
        echo "======================================="
    done <<< "$events"
    
    # Summary
    echo
    log_info "Test Summary:"
    echo "  Total tests: $test_count"
    echo "  Successful: $success_count"
    echo "  Failed: $((test_count - success_count))"
    
    if [[ $success_count -eq $test_count ]]; then
        log_success "All tests passed! 🎉"
    else
        log_warning "Some tests failed. Check the output above."
        exit 1
    fi
}

# Run main function
main "$@"


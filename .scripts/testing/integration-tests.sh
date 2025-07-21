#!/bin/bash

# Source common utilities
source "$(dirname "$0")/../common.sh"

show_script_header "Integration Tests" "Run end-to-end integration tests"
setup_cleanup

# Test configuration
readonly TEST_CONFIG_FILE="${SNAPNEWS_SCRIPTS_DIR}/testing/test_event.json"
readonly API_ENDPOINT=$(get_project_config "apiEndpoint" "")
readonly TEST_TIMEOUT=30

run_api_test() {
    local endpoint="$1"
    local expected_status="$2"
    local test_name="$3"
    
    log_info "Testing: $test_name"
    
    local response=$(curl -s -w "%{http_code}" -o /tmp/api_response.json --max-time "$TEST_TIMEOUT" "$endpoint" 2>/dev/null)
    local status_code="${response: -3}"
    
    if [[ "$status_code" == "$expected_status" ]]; then
        log_success "✅ $test_name - Status: $status_code"
        return 0
    else
        log_error "❌ $test_name - Expected: $expected_status, Got: $status_code"
        return 1
    fi
}

test_lambda_functions() {
    log_info "Testing Lambda functions..."
    
    if [[ ! -f "$TEST_CONFIG_FILE" ]]; then
        log_error "Test configuration file not found: $TEST_CONFIG_FILE"
        return 1
    fi
    
    local sources=$(jq -r '.[].NewsSource' "$TEST_CONFIG_FILE" | sort | uniq)
    local test_count=0
    local success_count=0
    
    while IFS= read -r source; do
        [[ -z "$source" ]] && continue
        
        ((test_count++))
        log_info "Testing Lambda with source: $source"
        
        if "${SNAPNEWS_SCRIPTS_DIR}/aws/test-reader.sh" "$source" >/dev/null 2>&1; then
            ((success_count++))
            log_success "✅ Lambda test passed for $source"
        else
            log_error "❌ Lambda test failed for $source"
        fi
    done <<< "$sources"
    
    log_info "Lambda tests completed: $success_count/$test_count passed"
    return $((test_count - success_count))
}

test_api_endpoints() {
    log_info "Testing API endpoints..."
    
    if [[ -z "$API_ENDPOINT" ]]; then
        log_warning "API endpoint not configured, skipping API tests"
        return 0
    fi
    
    local failed_tests=0
    
    # Test health endpoint
    run_api_test "${API_ENDPOINT}/health" "200" "Health check" || ((failed_tests++))
    
    # Test news sources endpoint
    run_api_test "${API_ENDPOINT}/sources" "200" "News sources" || ((failed_tests++))
    
    # Test invalid endpoint
    run_api_test "${API_ENDPOINT}/invalid" "404" "Invalid endpoint" || ((failed_tests++))
    
    return $failed_tests
}

test_database_connectivity() {
    log_info "Testing database connectivity..."
    
    # This would typically test database connections
    # For now, we'll simulate it
    if python3 -c "
import boto3
try:
    dynamodb = boto3.client('dynamodb')
    tables = dynamodb.list_tables()
    print('✅ Database connectivity successful')
    exit(0)
except Exception as e:
    print(f'❌ Database connectivity failed: {e}')
    exit(1)
" 2>/dev/null; then
        log_success "Database connectivity test passed"
        return 0
    else
        log_error "Database connectivity test failed"
        return 1
    fi
}

test_external_dependencies() {
    log_info "Testing external dependencies..."
    
    local failed_tests=0
    
    # Test news source availability (sample)
    local test_urls=(
        "https://www.ndtv.com:200:NDTV"
        "https://timesofindia.indiatimes.com:200:TOI"
    )
    
    for url_test in "${test_urls[@]}"; do
        local url="${url_test%%:*}"
        local expected="${url_test#*:}"
        local expected_status="${expected%%:*}"
        local name="${expected#*:}"
        
        run_api_test "$url" "$expected_status" "External source: $name" || ((failed_tests++))
    done
    
    return $failed_tests
}

main() {
    log_info "Starting integration tests..."
    echo ""
    
    # Check prerequisites
    check_dependencies curl jq python3 aws
    
    local total_failures=0
    
    # Run test suites
    echo "Running test suites..."
    echo "====================="
    
    test_lambda_functions || total_failures=$((total_failures + $?))
    echo ""
    
    test_api_endpoints || total_failures=$((total_failures + $?))
    echo ""
    
    test_database_connectivity || total_failures=$((total_failures + $?))
    echo ""
    
    test_external_dependencies || total_failures=$((total_failures + $?))
    echo ""
    
    # Summary
    echo "Integration Test Summary:"
    echo "========================"
    
    if [[ $total_failures -eq 0 ]]; then
        log_success "🎉 All integration tests passed!"
        exit 0
    else
        log_error "💥 $total_failures integration tests failed"
        exit 1
    fi
}

main "$@" 
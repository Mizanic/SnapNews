# ===============================
# Testing & Quality Assurance
# ===============================

# --- Variables ---
SOURCE ?= all
TEST_ENV ?= dev

# ===============================
# LAMBDA TESTING
# ===============================



test-reader:
	@echo "🧪 Testing Lambda reader [SOURCE=$(SOURCE)]..."
	$(AWS_SCRIPTS_DIR)/test-reader.sh $(SOURCE)

test-all:
	@echo "🔬 Running all tests..."
	@$(MAKE) test-reader SOURCE=all
	@$(MAKE) test-integration
	@$(MAKE) check-errors

test-integration:
	@echo "🔗 Running integration tests..."
	$(TESTING_SCRIPTS_DIR)/integration-tests.sh

# test-performance:
# 	@echo "⚡ Running performance tests..."
# 	$(TESTING_SCRIPTS_DIR)/performance-tests.sh

# ===============================
# ERROR MONITORING
# ===============================

check-errors:
	@echo "🔍 Checking Lambda errors..."
	python3 $(AWS_SCRIPTS_DIR)/check_lambda_errors.py


delete-logs:
	@echo "🗑️  Deleting CloudWatch logs..."
	$(AWS_SCRIPTS_DIR)/delete-logs.sh

# ===============================
# TESTING UTILITIES
# ===============================

test-setup:
	@echo "🔧 Setting up test environment..."
	$(TESTING_SCRIPTS_DIR)/setup-test-env.sh

# ===============================
# LOAD TESTING
# ===============================

# load-test:
# 	@echo "📈 Running load tests..."
# 	$(TESTING_SCRIPTS_DIR)/load-test.sh

# stress-test:
# 	@echo "💪 Running stress tests..."
# 	$(TESTING_SCRIPTS_DIR)/stress-test.sh




testing-help:
	@echo "🧪 Testing Commands:"
	@echo "  test-reader    Test Lambda reader [SOURCE=name]"
	@echo "  test-all       Run comprehensive test suite"
	@echo "  test-integration Run integration tests"
	@echo ""
	@echo "  Error Monitoring:"
	@echo "  check-errors   Check Lambda errors in CloudWatch"
	@echo "  delete-logs    Clean up old CloudWatch logs"
	@echo ""
	@echo "  Utilities:"
	@echo "  test-setup     Setup test environment"



.PHONY: test-reader test-all check-errors delete-logs test-integration test-setup
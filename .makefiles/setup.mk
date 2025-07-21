# ===============================
# Setup & Configuration
# ===============================

# --- Variables ---
ENV ?= dev

# ===============================
# ENVIRONMENT SETUP
# ===============================

.PHONY: layers config-env create-user set-sources

layers:
	@echo "📦 Creating Lambda layers..."
	$(BUILD_SCRIPTS_DIR)/create-layers.sh

config-env:
	@echo "⚙️  Configuring environment..."
	$(BUILD_SCRIPTS_DIR)/config-env.sh

create-user:
	@echo "👤 Creating user..."
	$(BUILD_SCRIPTS_DIR)/create-user.sh

set-sources:
	@echo "📰 Setting news sources..."
	python3 $(BUILD_SCRIPTS_DIR)/set_sources.py

# ===============================
# PROJECT INITIALIZATION
# ===============================

init: init-project

init-project:
	@echo "🚀 Initializing SnapNews project..."
	@$(MAKE) check-deps
	@$(MAKE) bootstrap
	@$(MAKE) layers
	@$(MAKE) config-env
	@echo "✅ Project initialization complete!"

init-dev:
	@echo "🔧 Setting up development environment..."
	@$(MAKE) init-project
	@$(MAKE) deploy-dev
	@$(MAKE) set-sources
	@echo "✅ Development environment ready!"

# ===============================
# DEPENDENCY MANAGEMENT
# ===============================

check-deps:
	@echo "🔍 Checking system dependencies..."
	$(UTILS_SCRIPTS_DIR)/check-dependencies.sh


# ===============================
# CONFIGURATION MANAGEMENT
# ===============================

config-dev:
	@echo "🔧 Configuring for development..."
	$(BUILD_SCRIPTS_DIR)/config-env.sh dev


setup-help:
	@echo "⚙️  Setup & Configuration Commands:"
	@echo "  Initialization:"
	@echo "  init-project    Initialize complete project"
	@echo "  init-dev        Setup development environment"
	@echo ""
	@echo "  Core Setup:"
	@echo "  layers          Create Lambda layers"
	@echo "  config-env      Configure environment variables"
	@echo "  create-user     Create system user"
	@echo "  set-sources     Configure news sources"
	@echo ""
	@echo "  Dependencies:"
	@echo "  check-deps      Check system dependencies"
	@echo ""
	@echo "  Configuration:"
	@echo "  config-dev      Configure for development"
	@echo ""
	@echo "  Data Setup:"
	@echo "  set-sources     Configure news sources"
	@echo ""
	@echo "  Cleanup:"
	@echo "  clean-project   Clean all build artifacts"
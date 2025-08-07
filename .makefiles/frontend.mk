# ===============================
# Frontend Development
# ===============================

# --- Variables ---
ADMIN_PORT ?= 3000
MOBILE_PORT ?= 8081
BUILD_ENV ?= development



# ===============================
# MOBILE APPLICATION
# ===============================

mobile-dev:
	@echo "📱 Starting mobile dev server..."
	$(BUILD_SCRIPTS_DIR)/mobile-dev.sh

mobile-build:
	@echo "🔨 Building mobile app..."
	$(BUILD_SCRIPTS_DIR)/mobile-build.sh

mobile-web:
	@echo "🌐 Starting mobile web server..."
	cd $(MOBILE_DIR) && npx expo start --web --port $(MOBILE_PORT)


mobile-clean:
	@echo "🧹 Cleaning mobile build artifacts..."
	rm -rf $(MOBILE_DIR)/dist $(MOBILE_DIR)/.expo
	rm -rf $(MOBILE_DIR)/node_modules/.cache

# ===============================
# EXPO SPECIFIC
# ===============================

mobile-start:
	@echo "🚀 Starting Expo development server..."
	cd $(MOBILE_DIR) && npx expo start

mobile-ios:
	@echo "📱 Building for iOS..."
	cd $(MOBILE_DIR) && npx expo run:ios

mobile-android:
	@echo "🤖 Building for Android..."
	cd $(MOBILE_DIR) && npx expo run:android

mobile-preview:
	@echo "👀 Creating preview build..."
	cd $(MOBILE_DIR) && npx expo build:web

# ===============================
# CROSS-PLATFORM TASKS
# ===============================

open-release:
	@echo "🔨 Opening release build..."
	@if [ -d /home/rehan/SnapNews/mobile/android/app/build/outputs/apk/release ]; then \
		explorer.exe "$$(wslpath -w /home/rehan/SnapNews/mobile/android/app/build/outputs/apk/release)"; \
	else \
		echo "❌ Directory not found."; \
	fi

# ===============================
# DEVELOPMENT UTILITIES
# ===============================

check-updates:
	@echo "🔄 Checking for dependency updates..."
	npm outdated --prefix $(ADMIN_DIR) || true
	npm outdated --prefix $(MOBILE_DIR) || true

update-deps:
	@echo "⬆️  Updating dependencies..."
	npm update --prefix $(ADMIN_DIR)
	npm update --prefix $(MOBILE_DIR)



frontend-help:
	@echo "🖥️  Frontend Commands:"
	@echo "  mobile-dev      Start mobile development server"
	@echo "  mobile-web      Start mobile web interface"
	@echo ""
	@echo ""
	@echo "  Mobile App:"
	@echo "  mobile-build    Build mobile app"
	@echo "  mobile-ios      Build for iOS"
	@echo "  mobile-android  Build for Android"
	@echo ""
	@echo "  Utilities:"
	@echo "  check-updates   Check for dependency updates"
	@echo "  update-deps     Update dependencies"

.PHONY: mobile-dev mobile-build mobile-web mobile-clean check-updates update-deps
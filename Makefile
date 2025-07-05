# Default stack target for CDK commands (use --all for clarity)
STACK ?= --all

# Construct full stack name based on STACK variable
ifeq ($(STACK),--all)
  FULL_STACK_NAME=$(STACK)
else
  FULL_STACK_NAME=SnapNews-$(STACK)Stack
endif

# --- Help Target ---
help:
	@echo "Usage: make [target] [VAR=value]"
	@echo ""
	@echo "Targets:"
	@echo "  help           Show this help message"
	@echo ""
	@echo "  --- CDK Core Targets (use STACK=... to specify stack, defaults to --all) ---"
	@echo "  deploy         Deploy specified stack(s) via CDK"
	@echo "  hotswap        Hotswap specified stack(s) via CDK"
	@echo "  destroy        Destroy specified stack(s) via CDK"
	@echo ""
	@echo "  --- Helper Scripts & Tasks ---"
	@echo "  layers         Create Lambda layers via script"
	@echo "  config-env     Configure/Get environment variables via script"
	@echo "  test-reader    Run reader test script"
	@echo "  create-user    Run create user script"
	@echo "  set-sources    Run set sources Python script"
	@echo ""
	@echo "  --- Admin Frontend ---"
	@echo "  dev            Run admin frontend dev server"
	@echo ""
	@echo "Example:"
	@echo "  make deploy STACK=SnapNews-ApiStack"
	@echo "  make hotswap STACK=MyLambdaStack"
	@echo "  make deploy-all"


# --- CDK Core Targets ---
# These targets accept the STACK variable (e.g., make deploy STACK=MyStack)

deploy:
	@echo ">>> Deploying stack(s): [$(FULL_STACK_NAME)]"
	cd backend && cdk deploy $(FULL_STACK_NAME) --require-approval never

hotswap:
	@echo ">>> Hotswapping stack(s): [$(FULL_STACK_NAME)]"
	cd backend && cdk deploy $(FULL_STACK_NAME) --hotswap

destroy:
	@echo ">>> Destroying stack(s): [$(FULL_STACK_NAME)]"
	cd backend && cdk destroy $(FULL_STACK_NAME) # Add --force if needed

watch:
	@echo ">>> Watching stack(s): [$(FULL_STACK_NAME)]"
	cd backend && cdk watch $(FULL_STACK_NAME)


# --- Helper Scripts & Tasks ---

layers:
	@echo ">>> Creating layers..."
	./.scripts/create-layers.sh

config-env:
	@echo ">>> Configuring environment..."
	./.scripts/config-env.sh

test-reader:
	@echo ">>> Running reader test..."
	./.scripts/test-reader.sh

create-user:
	@echo ">>> Creating user..."
	./.scripts/create-user.sh

set-sources:
	@echo ">>> Setting sources..."
	python3 ./.scripts/set_sources.py


# --- Admin Frontend ---

dev:
	@echo ">>> Starting admin dev server..."
	npm run --prefix ./admin/ dev


# --- Mobile Frontend ---

mobile-dev:
	@echo ">>> Starting mobile dev server..."
	./.scripts/mobile-dev.sh

mobile-build:
	@echo ">>> Building mobile app..."
	./.scripts/mobile-build.sh


# --- Phony Targets ---
# Ensures these targets run even if a file with the same name exists

.PHONY: help deploy hotswap destroy \
		deploy-all layers config-env \
		test-reader create-user set-sources dev
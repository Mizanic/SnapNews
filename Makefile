help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo "  deploy-api - Deploy the API"
	@echo "  deploy-admin - Deploy the admin portal"
	@echo "  config-env - Get the environment variables"


deploy-api:
	./scripts/deploy-api.sh

deploy-admin:
	./scripts/deploy-admin.sh

config-env:
	./scripts/config-env.sh

.PHONY: help deploy-api deploy-admin config-env
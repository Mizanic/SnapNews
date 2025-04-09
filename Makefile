help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo "  deploy-api - Deploy the API"
	@echo "  deploy-admin - Deploy the admin portal"
	@echo "  config-env - Get the environment variables"
	@echo "  layers - Create the layers"

deploy-api:
	./.scripts/deploy-api.sh

deploy-admin:
	./.scripts/deploy-admin.sh

config-env:
	./.scripts/config-env.sh

layers:
	./.scripts/create-layers.sh

.PHONY: help deploy-api deploy-admin config-env layers
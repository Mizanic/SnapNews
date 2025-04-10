help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo "  deploy-api - Deploy the API"
	@echo "  deploy-admin - Deploy the admin portal"
	@echo "  config-env - Get the environment variables"
	@echo "  layers - Create the layers"

config-env:
	./.scripts/config-env.sh

deploy-api:
	./.scripts/deploy-api.sh

deploy-admin:
	./.scripts/deploy-admin.sh
	make config-env

destroy-all:
	./.scripts/destroy-all.sh
	rm ./.env.web.local
	rm ./.env.cdk.local

layers:
	./.scripts/create-layers.sh

.PHONY: help deploy-api deploy-admin config-env layers
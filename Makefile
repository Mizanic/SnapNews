help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo "  deploy-api - Deploy the API"
	@echo "  deploy-admin - Deploy the admin portal"
	@echo "  config-env - Get the environment variables"
	@echo "  layers - Create the layers"


# CDK Related Commands
deploy-all:
	make deploy-api
	make deploy-admin

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

test-reader:
	./.scripts/test_reader.sh



# Admin Related Commands

dev:
	npm run --prefix ./admin/ dev


config-env:
	./.scripts/config-env.sh

create-user:
	./.scripts/create-user.sh

.PHONY: help dev deploy-api deploy-admin config-env layers create-user deploy-all destroy-all test-reader
# SnapNews Development Guide

## Project Organization

### Directory Structure
```
SnapNews/
├── Makefile              # Main build system and task runner
├── .makefiles/           # Modular Makefile components
│   ├── infrastructure.mk # CDK and AWS infrastructure
│   ├── testing.mk        # Testing and quality assurance
│   ├── frontend.mk       # Frontend development
│   └── setup.mk          # Setup and configuration
├── .scripts/             # Development and deployment scripts
│   ├── common.sh         # Shared utilities for all scripts
│   ├── aws/              # AWS-specific scripts
│   │   ├── test-reader.sh # Lambda function testing
│   │   ├── check_lambda_errors.py # Error monitoring
│   │   └── delete-logs.sh # Log management
│   ├── build/            # Build and setup scripts
│   │   ├── create-layers.sh # Lambda layer management
│   │   ├── config-env.sh # Environment configuration
│   │   └── create-user.sh # User management
│   ├── testing/          # Testing scripts and data
│   │   ├── test_event.json # Test data
│   │   └── integration-tests.sh # Integration testing
│   └── utils/            # Utility scripts
│       └── check-dependencies.sh # Dependency checking
├── backend/             # CDK infrastructure and Lambda functions
├── admin/               # Admin dashboard frontend
├── mobile/              # Mobile application
└── docs/                # Documentation
```

## Using the Make System

### Infrastructure Commands
```bash
# Deploy all stacks
make deploy

# Deploy specific stack
make deploy STACK=Api

# Hot-deploy for faster development
make hotswap STACK=Lambda

# Watch for changes and auto-deploy
make watch STACK=Api

# Destroy infrastructure
make destroy STACK=Api
```

### Testing & Development
```bash
# Test all Lambda sources
make test-reader

# Test specific source
make test-reader SOURCE=NDTV

# Check for Lambda errors
make check-errors

# Clean up temporary files and build artifacts
make clean
```

### Setup & Configuration
```bash
# Create Lambda layers
make layers

# Configure environment variables
make config-env

# Create user in system
make create-user

# Set up news sources
make set-sources
```

### Frontend Development
```bash
# Start admin dashboard dev server
make dev

# Start mobile dev server  
make mobile-dev

# Build mobile app
make mobile-build

# Start mobile web interface
make mobile-web
```

### Utility Commands
```bash
# Show project status
make status

# Get help
make help
```

## Script Organization Best Practices

### 1. Common Utilities
All scripts should source the common utilities:
```bash
#!/bin/bash
source "$(dirname "$0")/common.sh"

show_script_header "Script Name" "Description"
setup_cleanup

# Your script logic here
```

### 2. Error Handling
Use the provided logging functions:
```bash
log_info "Starting process..."
log_success "Process completed"
log_warning "Non-critical issue"
log_error "Error occurred"
fatal "Critical error - script will exit"
```

### 3. Dependency Checking
Check for required tools:
```bash
check_dependencies jq aws curl
# or individually
check_dependency "node" "Node.js"
```

### 4. Configuration
Use the configuration helpers:
```bash
region=$(get_aws_region)
api_key=$(get_project_config "apiKey" "default-value")
```

### 5. File Operations
Use safe file operations:
```bash
ensure_file_exists "$config_file"
ensure_dir_exists "$output_dir"
validate_json "$data_file"
```

## Variable Conventions

### Environment Variables
- `SNAPNEWS_DEBUG=1` - Enable debug logging
- `SNAPNEWS_PROJECT_ROOT` - Project root directory (auto-set)
- `SNAPNEWS_SCRIPTS_DIR` - Scripts directory (auto-set)

### Make Variables
- `STACK` - CDK stack name (default: --all)
- `ENV` - Environment (default: dev)
- `SOURCE` - News source for testing (default: all)

### Color Coding
Scripts use consistent color coding:
- 🔵 **Blue** - Information messages
- 🟢 **Green** - Success messages  
- 🟡 **Yellow** - Warning messages
- 🔴 **Red** - Error messages
- 🟣 **Purple** - Debug messages

## Adding New Scripts

### 1. Create the Script
```bash
#!/bin/bash
source "$(dirname "$0")/common.sh"

set -euo pipefail

show_script_header "My Script" "Script description"
setup_cleanup

main() {
    check_dependencies jq aws
    
    log_info "Starting script..."
    
    # Your logic here
    
    log_success "Script completed successfully"
}

main "$@"
```

### 2. Add to Makefile
Add a new target in the appropriate section:
```makefile
my-script:
	@echo "🔧 Running my script..."
	$(SCRIPTS_DIR)/my-script.sh
```

### 3. Update Help
Add the command to the help section with appropriate emoji and category.

### 4. Document
Update this file with any new patterns or conventions.

## Best Practices

### Script Development
1. **Always use error handling**: `set -euo pipefail`
2. **Source common utilities**: For consistent logging and helpers
3. **Validate inputs**: Check dependencies, files, and arguments
4. **Use proper exit codes**: 0 for success, non-zero for errors
5. **Clean up resources**: Use trap handlers for cleanup
6. **Provide helpful output**: Clear progress indicators and error messages

### Makefile Organization
1. **Group related commands**: Keep logical sections together
2. **Use variables**: Avoid hardcoding paths and names
3. **Provide help**: Document all targets with examples
4. **Use phony targets**: Prevent conflicts with filenames
5. **Handle parameters**: Support configuration through variables

### Testing
1. **Test with different inputs**: Validate edge cases
2. **Test error conditions**: Ensure proper error handling
3. **Test in clean environment**: Verify all dependencies are declared
4. **Test make targets**: Ensure all Makefile targets work correctly

## Troubleshooting

### Common Issues
1. **Permission denied**: `chmod +x .scripts/*.sh`
2. **Command not found**: Check dependencies with `make status`
3. **AWS errors**: Verify credentials with `aws sts get-caller-identity`
4. **JSON errors**: Validate JSON files with `jq . filename.json`

### Debug Mode
Enable debug logging:
```bash
SNAPNEWS_DEBUG=1 make test-reader SOURCE=NDTV
```

### Getting Help
```bash
make help              # Show all available commands
.scripts/script.sh     # Most scripts show usage when run without args
``` 
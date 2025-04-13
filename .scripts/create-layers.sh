#!/bin/bash
shopt -s expand_aliases
alias echo="echo -e"

# Main requirements file
MAIN_REQUIREMENTS_FILE=backend/requirements.txt

# Common requirements file
COMMON_REQUIREMENTS_FILE=backend/src/fn/requirements.txt
COMMON_OUTPUT_DIR=.layers/common/python

# Create the output directories
mkdir -p ${COMMON_OUTPUT_DIR}

# Download the dependencies for layers
pip install -r ${COMMON_REQUIREMENTS_FILE} --target ${COMMON_OUTPUT_DIR}

# Install all the dependencies for offline development users
pip install -r ${MAIN_REQUIREMENTS_FILE}
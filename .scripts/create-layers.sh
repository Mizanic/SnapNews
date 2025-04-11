#!/bin/bash
shopt -s expand_aliases
alias echo="echo -e"

# Main requirements file
MAIN_REQUIREMENTS_FILE=backend/requirements.txt

# Admin requirements file
ADMIN_REQUIREMENTS_FILE=backend/src/fn/admin/requirements.txt
ADMIN_OUTPUT_DIR=.layers/admin/python

# Reader requirements file
READER_REQUIREMENTS_FILE=backend/src/fn/reader/requirements.txt
READER_OUTPUT_DIR=.layers/reader/python

# Create the output directories
mkdir -p ${ADMIN_OUTPUT_DIR}
mkdir -p ${READER_OUTPUT_DIR}

# Download the dependencies for layers
pip install -r ${ADMIN_REQUIREMENTS_FILE} --target ${ADMIN_OUTPUT_DIR}
pip install -r ${READER_REQUIREMENTS_FILE} --target ${READER_OUTPUT_DIR}

# Install all the dependencies for offline development users
pip install -r ${MAIN_REQUIREMENTS_FILE}
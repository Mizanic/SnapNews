#!/bin/bash
shopt -s expand_aliases
alias echo="echo -e"


MAIN_REQUIREMENTS_FILE=backend/requirements.txt
ADMIN_REQUIREMENTS_FILE=backend/src/fn/admin/requirements.txt
ADMIN_OUTPUT_DIR=.layers/admin/python

mkdir -p ${ADMIN_OUTPUT_DIR}

pip install -r ${ADMIN_REQUIREMENTS_FILE} --target ${ADMIN_OUTPUT_DIR}
pip install -r ${MAIN_REQUIREMENTS_FILE}
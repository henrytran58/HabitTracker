#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Updating pip, setuptools, and wheel ---"
pip install --upgrade pip setuptools wheel

echo "--- Installing project dependencies ---"
pip install --upgrade --upgrade-strategy eager -r requirements.txt

# If you have other build steps, add them here
# For example:
# python manage.py collectstatic --noinput
# python manage.py migrate
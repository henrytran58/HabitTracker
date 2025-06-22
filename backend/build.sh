#!/usr/bin/env bash

set -e

echo "--- Checking Python version ---"
python --version
python3 --version

echo "--- Updating pip ---"
pip install --upgrade pip

echo "--- Installing/Upgrading setuptools and wheel ---"
# Reinstalling setuptools can sometimes clear out lingering older files
pip install --upgrade --force-reinstall setuptools wheel

echo "--- Installing project dependencies ---"
pip install --upgrade --upgrade-strategy eager -r requirements.txt

# If you have other build steps, add them here
# For example:
# python manage.py collectstatic --noinput
# python manage.py migrate
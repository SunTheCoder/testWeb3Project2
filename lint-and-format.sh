#!/bin/bash

# Run Python linter and formatter
echo "Running Python linter and formatter with Ruff..."
ruff check backend/app --fix

# Run JS linter and formatter
echo "Running JavaScript linter and formatter..."
npx eslint frontend/src/
npx prettier frontend/src --write
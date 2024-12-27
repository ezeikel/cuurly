#!/bin/bash

# Get the line containing "version:" from app.config.ts
version_line=$(grep 'version:' app.config.ts)

# Extract just the version number between the quotes
version=$(echo $version_line | sed -n 's/.*version: "\([^"]*\)".*/\1/p')

echo $version
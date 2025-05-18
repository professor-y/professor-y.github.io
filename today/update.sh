#!/bin/bash

# Get today's date parts
YEAR=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)

# Create folder path like 2025/05/17
DEST_DIR="./$YEAR/$MONTH/$DAY"

# Make directories (with parents)
mkdir -p "$DEST_DIR"

# Copy today.txt to the new folder as raw.txt
cp ./today/today.txt "$DEST_DIR/raw.txt"

# Copy index.html template
cp ./template/index.html "$DEST_DIR/index.html"

echo "Published blog for $YEAR-$MONTH-$DAY at $DEST_DIR"


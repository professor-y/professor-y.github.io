#!/bin/bash

# If no argument given, use today's date
if [ $# -eq 0 ]; then
  DATE_STR=$(date +%F)  # Outputs YYYY-MM-DD
else
  DATE_STR="$1"
fi

# Basic format check (optional but helpful)
if [[ ! "$DATE_STR" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "Invalid date format. Use YYYY-MM-DD."
  exit 1
fi

# Extract year, month, day
YEAR="${DATE_STR:0:4}"
MONTH="${DATE_STR:5:2}"
DAY="${DATE_STR:8:2}"

# Create folder path like 2025/05/17
DEST_DIR="./$YEAR/$MONTH/$DAY"

# Make directories (with parents)
# -p create the directory only if it doesn't exist.
mkdir -p "$DEST_DIR"

# Copy today.txt to the new folder as raw.txt
if [ ! -e $DEST_DIR/raw.txt ]; then
  cp ./today/my.txt "$DEST_DIR/raw.txt"
else
  echo "raw.txt already exists, skipping copy."
fi

# default...
TITLE="THE GRAND MASTER'S JOURNAL [$DATE_STR]"
DESCRIPTION="Private Journal | Personal Blog | NOT meant for everyone to read"
URLAPPEND="$YEAR/$MONTH/$DAY/"
# config...
# TITLE="Here can I write sth... ($DATE_STR)"
# DESCRIPTION="change it if wanted..."

# Copy index.html template
if [ ! -e $DEST_DIR/index.html ]; then
  # cp ./dev/template.html "$DEST_DIR/index.html"
  sed \
    -e "s/XXXX/${TITLE}/g" \
    -e "s/ZZZZ/${DESCRIPTION}/g" \
    -e "s|JJJJ|${URLAPPEND}|g" \
    ./dev/template.html > "$DEST_DIR/index.html"
else
  echo "index.html already exists, skipping copy."
fi

echo "Done processing $DEST_DIR"

#--------------------------------------
# references
# Get today's date parts
# YEAR=$(date +%Y)
# MONTH=$(date +%m)
# DAY=$(date +%d)
#

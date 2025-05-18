#!/bin/bash

YEAR=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)

DEST_DIR="./$YEAR/$MONTH/$DAY"
mkdir -p "$DEST_DIR"
cp ./today/today.txt "$DEST_DIR/raw.txt"
cp ./template/index.html "$DEST_DIR/index.html"

# Generate or update homepage index.html

HOMEPAGE="./index.html"
# Start fresh homepage with HTML boilerplate & title
cat > $HOMEPAGE <<EOF
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <title>馬腸記 - 歷史目錄</title>
  <style>
    body { font-family: 'Noto Serif TC', serif; padding: 2rem; background: #fffaf0; }
    a { text-decoration: none; color: #b22222; }
    a:hover { text-decoration: underline; }
    li { margin-bottom: 0.8rem; }
  </style>
</head>
<body>
  <h1>馬腸記歷史目錄</h1>
  <ul>
EOF

# Find all index.html files in date folders, sort ascending
find . -regex './[0-9]{4}/[0-9]{2}/[0-9]{2}/index.html' | sort | while read -r file; do
  # Extract date path from filename, e.g., ./2025/05/17/index.html -> 2025/05/17
  datepath=$(dirname "$file" | cut -c3-)
  echo "    <li><a href=\"$datepath/index.html\">$datepath</a></li>" >> $HOMEPAGE
done

# Close html tags
cat >> $HOMEPAGE <<EOF
  </ul>
</body>
</html>
EOF

echo "Homepage updated with all blog entries."


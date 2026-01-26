#!/bin/bash
# Scraper for skills.sh - fetches all skills via API pagination

OUTPUT_FILE="/home/harshith/clawd/skill-directory/data/skills-sh.json"
TEMP_DIR="/tmp/skills-scrape"
mkdir -p "$TEMP_DIR"

echo "Starting skills.sh scrape..."
echo '{"skills": [' > "$OUTPUT_FILE"

offset=0
total=0
has_more=true
first=true

while [ "$has_more" = "true" ]; do
    echo "Fetching offset $offset..."
    
    response=$(curl -s "https://skills.sh/api/skills?offset=$offset")
    
    # Extract skills array and hasMore
    skills=$(echo "$response" | jq -c '.skills[]')
    has_more=$(echo "$response" | jq -r '.hasMore')
    
    # Count skills in this batch
    batch_count=$(echo "$response" | jq '.skills | length')
    
    if [ "$batch_count" -eq 0 ]; then
        echo "No more skills returned, stopping."
        break
    fi
    
    # Append skills to file
    if [ "$first" = "true" ]; then
        first=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    
    echo "$response" | jq -c '.skills[]' | while read -r skill; do
        if [ "$total" -gt 0 ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        echo "$skill" >> "$OUTPUT_FILE"
        total=$((total + 1))
    done
    
    total=$((total + batch_count))
    offset=$((offset + 50))
    
    echo "Total so far: $total, hasMore: $has_more"
    
    # Small delay to be nice to the server
    sleep 0.1
done

echo '],"totalSkills":'$total',"scrapedAt":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' >> "$OUTPUT_FILE"

echo "Done! Total skills: $total"

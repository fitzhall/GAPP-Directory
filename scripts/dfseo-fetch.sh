#!/bin/bash
# DataForSEO research fetcher for Katie Beckett rewrite.
# Reads credentials from ~/gwinnett-junk-quote/.env.local (until copied locally).

set -e

ENV_FILE="${DFSEO_ENV_FILE:-$HOME/gwinnett-junk-quote/.env.local}"
LOGIN=$(grep "^DATAFORSEO_LOGIN=" "$ENV_FILE" | cut -d= -f2)
PASSWORD=$(grep "^DATAFORSEO_PASSWORD=" "$ENV_FILE" | cut -d= -f2)
AUTH=$(printf "%s:%s" "$LOGIN" "$PASSWORD" | base64)

RAW_DIR="docs/seo-research/katie-beckett/raw"
SEEDS_JSON="docs/seo-research/katie-beckett/raw/_keywords_flat.json"

# Locations
ATLANTA_DMA=200524
GEORGIA_STATE=21149   # DataForSEO code for Georgia, United States

cmd="$1"

case "$cmd" in
  volume-atl)
    KW=$(cat "$SEEDS_JSON")
    BODY=$(jq -n --argjson kw "$KW" --argjson loc $ATLANTA_DMA \
      '[{location_code: $loc, language_code: "en", keywords: $kw, search_partners: false}]')
    curl -s -X POST "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live" \
      -H "Authorization: Basic $AUTH" \
      -H "Content-Type: application/json" \
      -d "$BODY" \
      > "$RAW_DIR/01_volume_atlanta.json"
    echo "Atlanta DMA volume → $RAW_DIR/01_volume_atlanta.json"
    jq '.cost, .tasks[0].result_count' "$RAW_DIR/01_volume_atlanta.json"
    ;;
  volume-ga)
    KW=$(cat "$SEEDS_JSON")
    BODY=$(jq -n --argjson kw "$KW" --argjson loc $GEORGIA_STATE \
      '[{location_code: $loc, language_code: "en", keywords: $kw, search_partners: false}]')
    curl -s -X POST "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live" \
      -H "Authorization: Basic $AUTH" \
      -H "Content-Type: application/json" \
      -d "$BODY" \
      > "$RAW_DIR/02_volume_georgia.json"
    echo "Georgia state volume → $RAW_DIR/02_volume_georgia.json"
    jq '.cost, .tasks[0].result_count, .tasks[0].status_message' "$RAW_DIR/02_volume_georgia.json"
    ;;
  serp)
    # Pass query as arg 2, output suffix as arg 3
    Q="$2"
    SUFFIX="$3"
    BODY=$(jq -n --arg q "$Q" --argjson loc $ATLANTA_DMA \
      '[{language_code: "en", location_code: $loc, keyword: $q, depth: 20}]')
    curl -s -X POST "https://api.dataforseo.com/v3/serp/google/organic/live/advanced" \
      -H "Authorization: Basic $AUTH" \
      -H "Content-Type: application/json" \
      -d "$BODY" \
      > "$RAW_DIR/03_serp_${SUFFIX}.json"
    echo "SERP for '$Q' → $RAW_DIR/03_serp_${SUFFIX}.json"
    jq '.cost, .tasks[0].result[0].items_count' "$RAW_DIR/03_serp_${SUFFIX}.json"
    ;;
  ideas)
    # Pass seed keywords as comma-separated arg 2
    IFS=',' read -ra SEEDS <<< "$2"
    BODY=$(jq -n --argjson seeds "$(printf '%s\n' "${SEEDS[@]}" | jq -R . | jq -s .)" --argjson loc $ATLANTA_DMA \
      '[{location_code: $loc, language_code: "en", keywords: $seeds, limit: 200, include_serp_info: false}]')
    curl -s -X POST "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live" \
      -H "Authorization: Basic $AUTH" \
      -H "Content-Type: application/json" \
      -d "$BODY" \
      > "$RAW_DIR/04_keyword_ideas.json"
    echo "Keyword ideas → $RAW_DIR/04_keyword_ideas.json"
    jq '.cost, .tasks[0].result_count, .tasks[0].status_message' "$RAW_DIR/04_keyword_ideas.json"
    ;;
  *)
    echo "Usage: $0 {volume-atl|volume-ga|serp <query> <suffix>|ideas <seed1,seed2,...>}"
    exit 1
    ;;
esac

#!/bin/bash

LAYER='tract_points'
YEAR='2019'

NAME="$LAYER"_"$YEAR"

GEOJSON="$NAME".geojson
MBTILES="$NAME".mbtiles

node ./plotter.mjs -y "$YEAR" -o "$GEOJSON"

tippecanoe -zg -o "$MBTILES" \
  --coalesce-densest-as-needed \
  --extend-zooms-if-still-dropping \
  --accumulate-attribute=d:sum \
  "$GEOJSON"

# tippecanoe -zg -o "$MBTILES" -r1 \
#   --cluster-distance=1 \
#   --accumulate-attribute=d:sum \
#   "$GEOJSON"

scp ./"$MBTILES" \
  avail@saturn.availabs.org:~/code/avail_mbtiles_server/data/"$MBTILES"

rm ./"$NAME".*

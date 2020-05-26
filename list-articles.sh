#!/bin/sh

posts="["

found=$(ls ./src/assets/posts)

echo "articles found: $found"

for art in found
do
  posts="$posts\"$art\","
done
posts="$posts]"

echo ${posts/,]/]} > ./src/assets/posts.json

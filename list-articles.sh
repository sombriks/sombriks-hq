#!/bin/bash

posts="["

found=$(ls ./src/assets/posts)

echo "articles found:" 
echo "$found"

for art in $found
do
  posts="$posts\"$art\","
done

posts="$posts]"
posts=`echo $posts | sed 's/,]/]/'`

echo $posts > ./src/assets/posts.json



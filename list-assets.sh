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

pics="["

found=$(ls ./public/profile-pics)

echo "pictures found:"
echo "$found"

for pic in $found
do
  pics="$pics\"$pic\","
done

pics="$pics]"
pics=`echo $pics | sed 's/,]/]/'`

echo $pics > ./src/assets/pics.json


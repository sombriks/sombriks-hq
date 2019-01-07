
export PATH := ./node_modules/.bin:$(PATH)

clean: 
	rm -rf public

prepare:
	mkdir public

build: clean prepare
	# browserify src/main.js -o public/build.js
	# browserify src/main.js -o tmp.js
	# browserify src/main.js -p common-shakeify -o tmp.js
	# uglifyjs tmp.js --compress  --verbose > public/build.js
	# cp tmp.js public/build.js
	browserify src/main.js -p tinyify -o public/build.js
	cp index.html public/index.html
	cp -r assets public/assets
	# rm -rf tmp.js

release: build
	firebase deploy

dev: 
	budo src/main.js:build.js --live --wg="**.{html,css,js,vue,md}" --open -H 127.0.0.1
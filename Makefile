
clean: 
	rm -rf public
	mkdir public

build: clean
	browserify src/main.js -o public/build.js
	cp index.html public/index.html

release: build
	firebase deploy

dev: 
	budo src/main.js:build.js --live --open -H 127.0.0.1 -v
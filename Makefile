
clean: 
	rm -rf public
	mkdir public

build: clean
	browserify src/main.js -o public/build.js
	cp index.html public/index.html
	cp -r assets public/assets

release: build
	firebase deploy --token "1/kuw5t8u3MKV0I1BTigT8ZEmbppNq8fM_zVq3emuDhmc"

dev: 
	budo src/main.js:build.js --live --open -H 127.0.0.1
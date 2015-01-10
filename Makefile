JS = assets/js/vendor/jquery.js assets/js/vendor/three.js assets/js/application.js
CSS = assets/css/application.css

public/assets/js/application.js: $(JS)
	@mkdir -p public/assets/js
	@cat $^ > $@

public/assets/css/application.css: $(CSS)
	@mkdir -p public/assets/css
	@cp $^ $@

build: public/assets/js/application.js public/assets/css/application.css

watch:
	@bin/watch 'assets/**/*' 'make build'

clean:
	@rm -rf public/assets

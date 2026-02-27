JS = assets/js/vector.js \
	assets/js/matrix.js \
	assets/js/grid.js \
	assets/js/boid.js \
	assets/js/application.js
CSS = assets/css/application.css

build: public/assets/js/application.js public/assets/css/application.css

public/assets/js/application.js: $(JS)
	@mkdir -p public/assets/js
	@cat $^ > $@

public/assets/css/application.css: $(CSS)
	@mkdir -p public/assets/css
	@cp $^ $@

watch:
	@bin/watch 'assets/**/*' 'make build'

clean:
	@rm -rf public/assets

all: up
up:
	npm run serve
build-production:
	npm run build
tests:
	npm run test:unit
	npm run test:e2e
lint:
	npm run lint
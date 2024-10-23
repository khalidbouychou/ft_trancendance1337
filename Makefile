all: build

ssl:
	@bash ./generate-ssl.sh

up:
	@docker-compose up

build:
	docker-compose build --no-cache && docker-compose up


docker:
	@chmod +x deployment/initdocker.sh
	@./deployment/initdocker.sh

clean:
	@docker-compose down
	@docker system prune -af
	@rm -rf db
	@rm -rf ./frontd/certs
	@rm -rf ./backend/certs

push:
	@git add .
	@git commit -m "$(m)"
	@git push

re: all




all: up

ssl:
	@bash ./generate-ssl.sh

up:

	@docker-compose up

down :
	@docker-compose down

build:
	@rm -rf db
	@docker-compose build --no-cache && docker-compose up


docker:
	@chmod +x deployment/initdocker.sh
	@./deployment/initdocker.sh

clean:
	@rm -rf /**/node_modules
	@rm -rf /**/package-lock.json
	@rm -rf */*/migrations
	@rm -rf */*/__pycache__
	@rm -rf */*/certs
	@rm -rf */*/.env
	@rm -rf */*/.env.example
	@rm -rf front/certs
	@rm -rf backend
	@rm -rf db

	@rm -rf front/node_modules front/package-lock.json
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




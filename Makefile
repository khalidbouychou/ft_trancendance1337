# Load environment variables from .env file
ifneq ("$(wildcard .env)","")
    include .env
endif


all: up

ssl : 
	openssl req -newkey rsa:2048 -nodes -keyout $BACKEND/$DOMAIN.key -x509 -days 365 -out $BACKEND/$DOMAIN.crt -subj "/CN=$DOMAIN"


up:
	@docker-compose up

down :
	@docker-compose down

build:
	@rm -rf db
	@docker-compose build --no-cache && docker-compose up


clean:
	@rm -rf front/.vite-cashe/*
	@rm -rf front/.vite-cashe
	@rm -rf dump.rdb
	@rm -rf **/node_modules
	@rm -rf backend/uploads/*
	@rm -rf deployment
	@rm -rf front/README.md
	@rm -rf /**/node_modules
	@rm -rf /**/package-lock.json
	@rm -rf */*/migrations
	@rm -rf */*/__pycache__
	@rm -rf */*/certs
	@rm -rf */*/.env
	@rm -rf */*/.env.example
	@rm -rf front/certs
	@rm -rf backend/certs
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


re: clean all




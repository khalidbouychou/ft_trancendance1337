all : uploads_dir up
# Load environment variables from .env file
ifneq ("$(wildcard .env)","")
    include .env
endif

uploads_dir:
	@mkdir -p backend/uploads

.PHONY: all

s : 
	chmod +x ./ssl.sh
	./ssl.sh

up:
	@docker-compose up --build

down :
	@docker-compose stop
	@docker-compose down

clean:
	@rm -rf backend/uploads/*
	@rm -rf /**/node_modules
	@rm -rf */*/migrations
	@rm -rf */*/__pycache__
	@docker system prune -af
	@docker volume prune -af
	@rm -rf ssl/*

push: 
	@git add .
	@git commit -m "$(m)"
	@git push

re: clean all




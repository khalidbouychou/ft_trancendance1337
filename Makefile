all : up 
ifneq ("$(wildcard .env)","")
    include .env
endif

uploads_dir:
	@mkdir -p backend/uploads

up: uploads_dir
	@docker-compose up --build

# s : 
# 	chmod +x ./ssl.sh
# 	./ssl.sh

down :
	@docker-compose stop
	@docker-compose down

clean: down
	@rm -rf **/node_modules
	@rm -rf backend/uploads/*
	@rm -rf /**/node_modules
	@rm -rf */*/migrations
	@rm -rf */*/__pycache__
	@docker-compose down
	@docker system prune -af
	@docker volume prune -f
	@rm -rf nginx/ssl.*
	@rm -rf ssl/*

push: 
	@git add .
	@git commit -m "$(m)"
	@git push

re: clean all 

.PHONY: all push down s  uploads_dir

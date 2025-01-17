all : up 

uploads_dir:
	@mkdir -p backend/uploads

up: uploads_dir
	@docker-compose up --build

down :
	@docker-compose stop
	@docker-compose down

clean: down
	@docker system prune -af
	@docker volume prune -f
	@rm -rf **/node_modules
	@rm -rf backend/uploads/*
	@rm -rf /**/node_modules
	@rm -rf */*/migrations
	@rm -rf */*/__pycache__
	@rm -rf nginx/ssl.*
	@rm -rf ssl/*
	@rm */dist

push: 
	@git add .
	@git commit -m "$(m)"
	@git push

re: clean all 

.PHONY: all push down s  uploads_dir

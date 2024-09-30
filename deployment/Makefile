
# all: ssl
	# docker-compose up --build
all: down clean
	docker-compose up --build
docker :
	chmod +x ./initdocker.sh
	./initdocker.sh
clean:
	docker system prune -af
	docker volume prune -f
	docker image prune -af
	docker network prune -f
	docker container prune -f
	docker builder prune -f
	rm -rf frontend/node_modules
	rm -rf frontend/package-lock.json
	# rm -rf ./frontend/certs
	# rm -rf ./backend/certs
# ssl:
# 	bash ./generate_ssl.sh
down: clean
	docker-compose down

push :
	git add .
	git commit -m "update"
	git push
reload: down clean all

re: down all

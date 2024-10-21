

all: ssl
	docker-compose up 
ssl:
	bash ./generate-ssl.sh
build :
	docker-compose up --build
docker :
	chmod +x deployment/initdocker.sh
	./deployment/initdocker.sh
clean:
	docker system prune -af
	rm -rf fd/node_modules
	rm -rf fd/package-lock.json
	# rm -rf ./fd/certs
	# rm -rf ./bd/certs

down: clean
	rm -rf db/*
	docker-compose down

push :
	git add .
	git commit -m "update"
	git push


re: down all clean

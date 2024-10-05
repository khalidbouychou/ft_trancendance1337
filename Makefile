
# all: ssl
	# docker-compose up --build
all: 
	docker-compose up --build
docker :
	chmod +x ./initdocker.sh
	./initdocker.sh
clean:
	docker system prune -af
	rm -rf fd/node_modules
	rm -rf fd/package-lock.json
	# rm -rf ./fd/certs
	# rm -rf ./bd/certs
# ssl:
# 	bash ./generate_ssl.sh
down: clean
	docker-compose down

push :
	git add .
	git commit -m "update"
	git push


re: down all clean

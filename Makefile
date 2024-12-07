
# all: ssl
	# docker-compose up
all: 
	docker-compose up 
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
# ssl:
# 	bash ./generate_ssl.sh
down: clean
	rm -rf db/*
	docker-compose down

push :
	git add .
	git commit -m ${m}
	git push


re: down all clean

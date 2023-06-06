


#This makefile handles the common commands from the project
TAG := $$(git rev-parse --short HEAD)
# TAG := $$(git describe --tags --abbrev=0)

.PHONY: run build docker-run all

#This command will run the project using concurrent package from npm
run:
	npm run dev

build: 
	export TAG=${TAG} && docker build -t gateway:$(TAG) -f Dockerfile.gateway .

docker-run: 
	export TAG=${TAG} && docker run  -p 4040:4040  -it gateway:$(TAG) --env-file ./env

docker-run-staging:
	docker run --net deploy_default -d -p 4040:4040  -it gateway:4d7c529 --env-file ./env

all: clean install run

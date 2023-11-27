.PHONY: build
build:
	docker build . --tag music-recommendation-survey-api:latest

.PHONY: start
start:
	docker run --name music-recommendation-survey-api -d -p 8080:8080 music-recommendation-survey-api:latest

.PHONY: stop
stop:
	docker stop music-recommendation-survey-api
	docker rm music-recommendation-survey-api
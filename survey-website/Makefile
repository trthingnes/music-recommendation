.PHONY: build
build:
	docker build . --tag music-recommendation-survey-website:latest

.PHONY: start
start:
	docker run --name music-recommendation-survey-website -d -p 3000:3000 music-recommendation-survey-website:latest

.PHONY: stop
stop:
	docker stop music-recommendation-survey-website
	docker rm music-recommendation-survey-website
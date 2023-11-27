FROM node:18-alpine

WORKDIR /survey-website

ENV REACT_APP_BE_URL http://cs470.thingn.es:8080

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
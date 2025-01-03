# fitness-web

## Feature Flow Diagram

<img width="920" alt="image" src="https://github.com/user-attachments/assets/6a576656-931a-446d-b68b-a1a4604781b4">

## System Architecture Diagram

<img width="683" alt="image" src="https://github.com/user-attachments/assets/7bfe943f-4d4e-426f-b24d-b6caf5ddf124">

## Development
### Install mongo db
```
visit https://www.mongodb.com/docs/manual/administration/install-community/
```

### Start client
```
cd client
npm install
npm start
```
### Start server (API)
```
cd server/src
npm install
node index.js
```

## Docker (Option 2)
#### Initiate entire stack (client, server API, mongodb) and spin them as containers
#### Uses nginx as a proxy

### Install Docker Desktop to your machine
```
https://docs.docker.com/get-started/introduction/get-docker-desktop/
after setup, ensure docker engine is running in docker desktop
```
### Run Command from terminal to make sure docker is running
```
docker ps
```
### Finally run below commands to bring the app up
```
docker-compose up --build (first time)
docker-compose up
```

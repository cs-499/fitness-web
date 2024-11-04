# fitness-web

## Feature Flow Diagram

<img width="920" alt="image" src="https://github.com/user-attachments/assets/6a576656-931a-446d-b68b-a1a4604781b4">

## System Architecture Diagram

<img width="683" alt="image" src="https://github.com/user-attachments/assets/7bfe943f-4d4e-426f-b24d-b6caf5ddf124">

## Development
### Install mongo db
### Start client
```
npm install
npm start
```
### Start server (API)
```
npm install
node index.js OR npm run devStart
```
### Run tests
```
npm test
```

### Docker
#### Initiate entire stack (client, server API, mongodb) and spin them as containers
#### Uses nginx as a proxy
```
docker-compose up --build (first time)
docker-compose up
```
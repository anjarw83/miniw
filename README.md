# Mini Wallet
Sample Exercise mini wallet

Requirements:
* NodeJs
* MongoDb

## Installation
 
Install all Dependencies
>npm i

Initialize Database

>npm run migration:up

Ensure all migration up

>npm run migration:status


## Run Application
Adjust Port and db connection in `nodemon.js`
Default apps port is `9000` & db port at `27017`

Run apps using
> npm run start

## Run Tests
Run test using
> npm run test

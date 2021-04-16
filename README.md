# Color guesser game backed

This is a server created on Express using Typescript for providing all the bussines logic for the color guesser game.

## Setup

`npm install` -> Install dependencies

`npm run start` -> run the development server using serverless offline plugin

`npm run test` -> Launch all unit tests
∏

## API

### Endpoints

| Endpoin  | TYPE |                            Data needed | Returned value          |
| -------- | :--: | -------------------------------------: | ----------------------- |
| /newGame | POST |                   {maxAttempt: number} | gameId: string          |
| /guess   | POST | {gameId:string, correctColors: number} | WIN/LOST/number_of_hits |

## AWS

To deploy your app on AWS Lambda you will need to provide in your .env file the following variables:

NODE_ENV --> env of application (development/production)
ACCESS_KEY --> Access key of your IAM user
SECRET_KEY --> Secret key of your IAM user
BUCKET_NAME --> Name of the S3 bucket where to store the data

## Deploy

`sls deploy --stage production` --> for productioon

`sls deploy --stage development` --> for development

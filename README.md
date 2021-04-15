# Color guesser game backed

This is a server created on Express using Typescript for providing all the bussines logic for the color guesser game.

## Setup

`npm install` -> Install dependencies

`npm run start` -> run the development server using serverless offline plugin

`npm run test` -> Launch all unit tests

## API

### Endpoints

| Endpoin  | TYPE |                            Data needed | Returned value          |
| -------- | :--: | -------------------------------------: | ----------------------- |
| /newGame | POST |                   {maxAttempt: number} | gameId: string          |
| /guess   | POST | {gameId:string, correctColors: number} | WIN/LOST/number_of_hits |

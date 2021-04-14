import { isProduction } from "../utils"
import { Game } from "../types";
import AWS from 'aws-sdk';
import fse from "fs-extra";

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
});

export const createOrUpdateGame = (game: Game): void => {
    if(isProduction()) {
        const gameToStore = JSON.stringify(game);
        const params = {
            Bucket: process.env.BUCKET_NAME || "",
            Key: `${game.gameId}.json`,
            Body: gameToStore
        };
    
        // Uploading game to the bucket
        s3.upload(params).promise().then((data) => {
            console.log(`Game uploaded successfully. ${data.Location}`);
        }).catch((error) => {
            console.log(error);
        })
    } else {
        try {
            const gameToStore = JSON.stringify(game);
            console.log("gameToStore", gameToStore)
            fse.outputFileSync(`./localState/${game.gameId}.json`, gameToStore);
        } catch (error) {
            console.log(error);
        }
        
    }
}

export const getGame = (gameId: string) => {
    if(isProduction()) {
        const params = {
            Key: `${gameId}.json`,
            Bucket: process.env.BUCKET_NAME || ""
        }

        //Retrieving the game from the bucket
        s3.getObject(params).promise().then((data) => {
            let game: Game;
            game = data.Body !== undefined ? JSON.parse(data.Body.toString('utf-8')) : null;
            console.log('game state downloaded successfully');
            return game;
        }).catch((error) => {
            console.log(error);
        })
    } else {
        try {
            const rawdata = fse.readFileSync(`./localState/${gameId}.json`);
            const game: Game = JSON.parse(rawdata.toString());
            return game;
        } catch (error) {
            console.log(error);
        }
    }
}
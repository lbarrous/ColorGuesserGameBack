import { isProduction } from "../utils";
import { Game } from "../types";
import fse from "fs-extra";
import { S3Client } from "./s3Client";

const s3Client = new S3Client(
  process.env.ACCESS_KEY || "",
  process.env.SECRET_KEY || ""
);

const saveToS3Bucket = async (game: Game): Promise<void> => {
    const gameToStore = JSON.stringify(game);
    const s3Upload = s3Client.createPutPublicJsonRequest(
        process.env.BUCKET_NAME || "",
        `${game.gameId}.json`,
        gameToStore
      );
      try {
        await s3Client.put(s3Upload);
        console.log(`Game stored: ${game.gameId}`);
      } catch (err) {
        console.log(err);
      }
};

const saveToLocal = async (game: Game): Promise<void> => {
    const gameToStore = JSON.stringify(game);
    try {
        await fse.outputFile(`./localState/${game.gameId}.json`, gameToStore);
      } catch (error) {
        console.log(error);
      }
}

const getGameFromS3Bucket = async (gameId: string): Promise<Game | null> => {
    const seDownload = s3Client.createGetPublicJsonRequest(
        process.env.BUCKET_NAME || "",
        `${gameId}.json`,
      );
      try {
        const s3Response = await s3Client.get(seDownload);
        let game: Game;
        game =
        s3Response.Body !== undefined
            ? JSON.parse(s3Response.Body.toString("utf-8"))
            : null;
        console.log(`Game ${gameId} retrieved successfully.`);
        return game;
      } catch (err) {
        console.log(err);
        return null;
      }
};

const getGameFromLocal = async (gameId: string): Promise<Game | null> => {
    try {
        const rawdata = await fse.readFile(`./localState/${gameId}.json`);
        const game: Game = JSON.parse(rawdata.toString());
        console.log(`Game ${gameId} retrieved successfully.`);
        return game;
      } catch (error) {
        console.log(error);
        return null;
      }
}

export const createOrUpdateGame = async (game: Game): Promise<void> => {
  if (isProduction()) {
    return await saveToS3Bucket(game);
  } else {
    return await saveToLocal(game);
  }
};

export const getGame = async (gameId: string): Promise<Game | null> => {
  if (isProduction()) {
    return await getGameFromS3Bucket(gameId) || null;
  } else {
    return await getGameFromLocal(gameId);
  }
};

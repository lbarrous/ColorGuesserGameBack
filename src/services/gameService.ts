import { v4 as uuidv4 } from "uuid";
import { INITIAL_COLOURS, WELCOME_MESSAGE } from "../constants";
import { createOrUpdateGame, getGame } from "../database";
import { COLOUR, Game, GAMESTATE, Result } from "../types";
import {
  arrayEquals,
  getCorrectValuesFromGuess,
  isGame,
  shuffleArray,
} from "../utils";

export class GameService {
  public getWelcomeMessage() {
    return WELCOME_MESSAGE;
  }

  public async createNewGame(maxAttempts: number): Promise<Game> {
    const newGame: Game = {
      gameId: uuidv4(),
      combination: shuffleArray(INITIAL_COLOURS),
      maxAttempts,
      guesses: 0,
      gameState: GAMESTATE.IN_PROGRESS,
    };
    await createOrUpdateGame(newGame);
    return newGame;
  }

  private async getGame(gameId: string): Promise<Game | null> {
    return await getGame(gameId);
  }

  public async guessCombination(
    gameId: string,
    colourGuess: COLOUR[]
  ): Promise<GAMESTATE | Result | null> {
    const currentGame = await this.getGame(gameId);
    if (isGame(currentGame)) {
      let newGame: Game;
      let result: GAMESTATE | Result;
      if (arrayEquals(currentGame.combination, colourGuess)) {
        result = GAMESTATE.WON;
        newGame = {
          ...currentGame,
          guesses: currentGame.guesses + 1,
          gameState: result,
        };
      } else {
        if (currentGame.guesses < currentGame.maxAttempts - 1) {
          result = {
            hits: currentGame.guesses + 1,
            correctColors: getCorrectValuesFromGuess(
              colourGuess,
              currentGame.combination
            ),
          };
          newGame = {
            ...currentGame,
            guesses: result.hits,
          };
        } else {
          result = GAMESTATE.LOST;
          newGame = {
            ...currentGame,
            guesses: currentGame.guesses + 1,
            gameState: result,
          };
        }
      }
      await createOrUpdateGame(newGame);
      return result;
    } else {
      return null;
    }
  }
}

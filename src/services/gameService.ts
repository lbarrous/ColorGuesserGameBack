import { v4 as uuidv4 } from "uuid";
import { INITIAL_COLOURS, WELCOME_MESSAGE } from "../constants";
import { createOrUpdateGame, getGame } from "../database";
import { COLOUR, FinalResult, Game, GAMESTATE, GuessResult } from "../types";
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

  private async getNewStateOfGame(
    newColourGuess: COLOUR[],
    currentGame: Game | null
  ) {
    if (isGame(currentGame)) {
      let newGame: Game;
      let result: FinalResult | GuessResult;
      if (arrayEquals(currentGame.combination, newColourGuess)) {
        result = {
          resultOfGame: GAMESTATE.WON,
        };
        newGame = {
          ...currentGame,
          guesses: currentGame.guesses + 1,
          gameState: GAMESTATE.WON,
        };
      } else {
        if (currentGame.guesses < currentGame.maxAttempts - 1) {
          result = {
            hits: currentGame.guesses + 1,
            correctColors: getCorrectValuesFromGuess(
              newColourGuess,
              currentGame.combination
            ),
          };
          newGame = {
            ...currentGame,
            guesses: result.hits,
          };
        } else {
          result = {
            resultOfGame: GAMESTATE.LOST,
            solution: currentGame.combination,
          };
          newGame = {
            ...currentGame,
            guesses: currentGame.guesses + 1,
            gameState: GAMESTATE.LOST,
          };
        }
      }
      await createOrUpdateGame(newGame);
      return result;
    } else {
      return null;
    }
  }

  public async guessCombination(
    gameId: string,
    colourGuess: COLOUR[]
  ): Promise<FinalResult | GuessResult | null> {
    const currentGame = await this.getGame(gameId);
    return await this.getNewStateOfGame(colourGuess, currentGame);
  }
}

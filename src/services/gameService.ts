import { INITIAL_COLOURS, WELCOME_MESSAGE } from "../constants";
import { COLOUR, Game, GAMESTATE, Hits } from "../types";
import { arrayEquals, shuffleArray } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { createOrUpdateGame, getGame } from "../database";

export class GameService {
  public getWelcomeMessage() {
    return WELCOME_MESSAGE;
  }

  public createNewGame(maxAttempts: number): Game {
    const newGame: Game = {
      gameId: uuidv4(),
      combination: shuffleArray(INITIAL_COLOURS),
      maxAttempts,
      guesses: 0,
      gameState: GAMESTATE.IN_PROGRESS
    };
    createOrUpdateGame(newGame);
    return newGame;
  }

  private getGame(gameId: string): Game {
    return getGame(gameId) || null as any;
  }

  public guessCombination(gameId: string, colourGuess: COLOUR[]): GAMESTATE | Hits {
    const currentGame = this.getGame(gameId);
    let newGame: Game;
    let result: GAMESTATE | Hits;
    if (arrayEquals(currentGame.combination, colourGuess)) {
      result = GAMESTATE.WON;
      newGame = {
        ...currentGame,
        guesses: currentGame.guesses + 1,
        gameState: result
      };
    } else {
      if (currentGame.guesses < currentGame.maxAttempts - 1) {
        result = { hits: currentGame.guesses + 1 };
        newGame = {
          ...currentGame,
          guesses: result.hits
        };
      } else {
        result = GAMESTATE.LOST;
        newGame = {
          ...currentGame,
          guesses: currentGame.guesses + 1,
          gameState: result
        };
      }
    }
    createOrUpdateGame(newGame);
    return result;
  }
}

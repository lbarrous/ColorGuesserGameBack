import { Request, Response, Router } from "express";
import { GameService } from "../services/gameService";
import { COLOUR } from "../types";
import {
  guessCombinationValidationRules,
  newGameValidationRules,
  validate,
} from "../validator";

export class GameController {
  public router = Router();

  constructor(private gameService: GameService) {
    this.setRoutes();
  }

  private welcome = (_: Request, res: Response) => {
    const welcomeMessage = this.gameService.getWelcomeMessage();
    res.send(welcomeMessage);
  };

  private newGame = async (req: Request, res: Response) => {
    try {
      const newGame = await this.gameService.createNewGame(
        parseInt(req.body.maxAttempts)
      );
      res.send(newGame.gameId);
    } catch (e) {
      res.status(500).send(e.message);
    }
  };

  private guessCombination = async (req: Request, res: Response) => {
    try {
      const resultOfGuess = await this.gameService.guessCombination(
        req.body.gameId,
        req.body.guess as COLOUR[]
      );
      res.send(resultOfGuess);
    } catch (e) {
      res.status(500).send(e.message);
    }
  };

  public setRoutes() {
    this.router.get("/", this.welcome);
    this.router
      .route("/newGame")
      .post(validate(newGameValidationRules()), this.newGame);
    this.router
      .route("/guess")
      .post(validate(guessCombinationValidationRules()), this.guessCombination);
  }
}

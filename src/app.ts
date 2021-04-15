import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import { GameController } from "./controllers/gameController";
import { GameService } from "./services/gameService";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setControllers();
  }

  private setConfig() {
    // Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: "50mb" }));
    // Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    // Enables cors
    this.app.use(cors());
  }

  private setControllers() {
    // Creating a new instance of our Duty Controller
    const gameController = new GameController(new GameService());

    // Telling express to use our Controller's routes
    this.app.use("/api", gameController.router);
  }
}

export default new App().app;

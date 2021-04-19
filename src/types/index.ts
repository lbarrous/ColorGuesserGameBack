export enum COLOUR {
  R = "red",
  G = "green",
  B = "blue",
  Y = "yellow",
  P = "purple",
}

export enum GAMESTATE {
  WON = "WON",
  LOST = "LOST",
  IN_PROGRESS = "IN_PROGRESS",
}

export interface Game {
  gameId: string;
  combination: COLOUR[];
  maxAttempts: number;
  guesses: number;
  gameState: GAMESTATE;
}

export interface GuessResult {
  hits: number;
  correctColors: number;
}

export interface FinalResult {
  resultOfGame: GAMESTATE;
  solution?: COLOUR[];
}

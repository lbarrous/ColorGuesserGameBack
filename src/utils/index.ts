import { COLOUR, Game } from "../types";

export const shuffleArray = (array: COLOUR[]): COLOUR[] => {
  const newArray = array.slice(0);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const arrayEquals = (a: any[], b: any[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export const isGame = (game: Game | null): game is Game =>
  (game as Game).gameId !== undefined;

export const getCorrectValuesFromGuess = (
  colourGuess: COLOUR[],
  colorCorrectCombination: COLOUR[]
): number => {
  return colourGuess.filter((color, i) => color === colorCorrectCombination[i])
    .length;
};

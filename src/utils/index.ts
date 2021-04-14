import { COLOUR } from "../types";

export const shuffleArray = (array: COLOUR[]): COLOUR[] => {
  const newArray = array.slice(0);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const isProduction = (): boolean => {
  return process.env.APP_MESSAGE === "production";
};

export const arrayEquals = (a: any[], b: any[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);

  function isArray(arr: any): arr is Array<any> {
    return !!arr.length
  }
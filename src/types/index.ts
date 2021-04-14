export enum COLOUR {
    R="R",
    G="G",
    B="B",
    Y="Y",
    P="P",
}

export enum GAMESTATE {
    WON="WON",
    LOST="LOST",
    IN_PROGRESS="IN_PROGRESS"
}

export interface Game {
    gameId: string;
    combination: COLOUR[];
    maxAttempts: number;
    guesses: number;
    gameState: GAMESTATE;
}

export interface Hits {
    hits: number;
}
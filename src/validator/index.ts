import { body, validationResult } from "express-validator";
import { Request, Response } from "express";

export const newGameValidationRules = () => {
  return [body("maxAttempts").exists().notEmpty()];
};

export const guessCombinationValidationRules = () => {
  return [
    body("guess")
      .exists()
      .notEmpty()
      .isArray(),
    body("gameId").exists().notEmpty()
  ];
};

export const validate = (schemas: any[]) => {
  return async (req: Request, res: Response, next: any) => {
    await Promise.all(schemas.map(schema => schema.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array();
    return res.send(errors);
  };
};

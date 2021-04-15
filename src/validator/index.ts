import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const newGameValidationRules = () => {
  return [
    body("maxAttempts")
      .exists()
      .notEmpty()
  ];
};

export const guessCombinationValidationRules = () => {
  return [
    body("guess")
      .exists()
      .notEmpty()
      .isArray(),
    body("gameId")
      .exists()
      .notEmpty()
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
    return res.status(300).send(errors);
  };
};

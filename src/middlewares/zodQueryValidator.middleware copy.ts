import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const zodQueryValidatorMildderware = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
  const parseResult = schema.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json(parseResult.error);
    return;
  }
  req.query = parseResult.data;
  next();
}

export default zodQueryValidatorMildderware;
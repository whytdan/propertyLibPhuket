import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const zodValidatorMildderware = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json(parseResult.error);
    return;
  }
  req.body = parseResult.data;
  next();
}

export default zodValidatorMildderware;
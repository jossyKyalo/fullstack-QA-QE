import { Request, Response, NextFunction } from "express";
/**
 * @desc- avoid the problem of try catch not automatically passed to asynchronous
 * @param fn The asynchronous function to wrap async functions
 * @returns A function that executes the async function and catches the error
 */
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;

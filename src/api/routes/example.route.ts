import { Router, Request, Response, NextFunction } from "express";

const exampleRouter = Router();

exampleRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "TypeScript route working!" });
});

export default exampleRouter;

import { Request, Response } from "express";
import { catchSync } from "../middleware/catchError";
import { getUserIdOrThrow } from "../utils/validation";
import { calculateKiffScoreForUser } from "../services/kiff-score.service";
import { handleCoreResponse } from "../utils/handleCoreResponse";

export const getKiffScore = catchSync(async (req: Request, res: Response) => {
  const userId = getUserIdOrThrow(req);
  await handleCoreResponse(() => calculateKiffScoreForUser(userId), res);
}) 
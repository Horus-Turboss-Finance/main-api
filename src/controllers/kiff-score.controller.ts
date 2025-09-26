import { catchSync } from "../middleware/catchError";
import { getUserIdOrThrow } from "../utils/validation";
import { calculateKiffScoreForUser } from "../services/kiff-score.service";
import { handleCoreResponse } from "../utils/handleCoreResponse";

export const getKiffScore = catchSync(async (req, res) => {
  const userId = getUserIdOrThrow(req);
  await handleCoreResponse(() => calculateKiffScoreForUser(userId), res);
}) 
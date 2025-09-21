import { handleOnlyDataCore } from "../utils/handleCoreResponse";
import { HTTP_CODE } from "../middleware/responseException";
import { Newsletter } from "../models/newsletter.models";
import { CoreResponse } from "../types/@types.core";

export const newMailNewsletterCore = async (email: string): CoreResponse<string> => {
  return handleOnlyDataCore(
    () => Newsletter.insert(email).then(() => "Email ajouté"),
    {"Email exist": ["Email déjà existant", HTTP_CODE.Unauthorized]},
    "newsletter", "newMailNewsletterCore"
  )
}

export const sizeDBCore = async (): CoreResponse<number|string> => {
  return handleOnlyDataCore(
    () => Newsletter.sizeDB(),
    {},
    "newsletter", "sizeDBCore"
  )
}
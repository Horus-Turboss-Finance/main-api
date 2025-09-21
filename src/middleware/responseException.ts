export const HTTP_CODE = {
  UnknownError: "UnknownError",
  InvalidToken: "InvalidToken",
  TooManyRequests: "TooManyRequests",
  IMATeapot: "IMATeapot",
  PayloadTooLarge: "PayloadTooLarge",
  NotFound: "NotFound",
  MethodNotAllowed: "MethodNotAllowed",
  Forbidden: "Forbidden",
  PaymentRequired: "PaymentRequired",
  Unauthorized: "Unauthorized",
  BadRequest: "BadRequest",
  OK: "OK",
  Success: "Success",
}

const ResponseCodes = {
  UnknownError: 500,
  InvalidToken: 498,
  TooManyRequests: 429,
  IMATeapot: 418,
  PayloadTooLarge: 413,
  NotFound: 404,
  MethodNotAllowed: 405,
  Forbidden: 403,
  PaymentRequired: 402,
  Unauthorized: 401,
  BadRequest: 400,
  OK: 201,
  Success: 200,
}

export type ResponseCodeKey = keyof typeof ResponseCodes;
export type ResponseCodeValue = typeof ResponseCodes[ResponseCodeKey];

// Classe principale
class ResponseExceptions {
  reason: string;
  constructor(reason: unknown) {
    this.reason = typeof reason == "string" ? reason : JSON.stringify(reason);
  }
}

type ResponseExceptionMethods = {
    [K in ResponseCodeKey]: () => { status: ResponseCodeValue; data: string };
};

for (const key of Object.keys(ResponseCodes) as ResponseCodeKey[]) {
    (ResponseExceptions.prototype as any)[key] = function () {
      return {status: ResponseCodes[key], data: (this as ResponseExceptions & ResponseExceptionMethods).reason}
    };
}

export const ResponseException = (reason:unknown="") => new ResponseExceptions(reason) as ResponseExceptions & ResponseExceptionMethods;
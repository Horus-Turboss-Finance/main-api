import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import express, { Request, Response, Router } from "express";

import './types/@types.user';

import AuthRoutes from "./routers/auth.routes";
import UserRoutes from "./routers/user.routes";
import metricsRoute from "./routers/metrics.routes";
import ContactRoutes from "./routers/contact.routes";
import settingRoutes from "./routers/settings.routes";
import newsletterRoutes from "./routers/newsletter.routes";
import TransactionRoutes from "./routers/transaction.routes";

import { catchSync } from "./middleware/catchError";
import { requestLogger } from "./middleware/requestLogger";
import { securityLogger } from "./middleware/securityLogger";
import { ResponseException } from "./middleware/responseException";
import { ResponseProtocole } from "./middleware/responseProtocole";

const app = express();

/** ===================== Security Middlewares ===================== */
app.use(helmet());

/** ===================== Logging ===================== */
app.use(requestLogger);
app.use(securityLogger);

/** ===================== CORS Configuration ===================== */
const whitelist: (string | RegExp)[] = [
  "https://cashsight.fr",
  /\.cashsight\.fr$/,
  "https://api.cashsight.fr",
  /\.api\.cashsight\.fr$/,
  "https://beta.cashsight.fr",
  /\.beta\.cashsight\.fr$/,
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if(process.env.NODE_ENV?.toUpperCase() === "DEVELOPMENT"){
      return callback(null, true);
    }

    if (!origin || whitelist.some(w => typeof w === "string" ? w === origin : w.test(origin))) {
      callback(null, true);
    } else {
      callback(ResponseException("Origine CORS non autorisée").Forbidden() as any);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

/** ===================== Rate Limiting ===================== */
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // 100 requests per IP
  message: ResponseException("Trop de requêtes").TooManyRequests(),
});
app.use(limiter);

/** ===================== Body Parsing & File Upload ===================== */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: false,
    createParentPath: true,
    abortOnLimit: true,
    responseOnLimit: JSON.stringify(ResponseException("Fichier trop volumineux").PayloadTooLarge()),
    parseNested: true
}))

/** ===================== Metrics ===================== */
app.use("/metrics", metricsRoute);

/** ===================== API Routes ===================== */
const apiRoutes: [string, Router][] = [
  ["/auth", AuthRoutes],
  ["/newsletter", newsletterRoutes],
  ["/contact", ContactRoutes],
  ["/user", UserRoutes],
  ["/settings", settingRoutes],
  ["/transaction", TransactionRoutes],
];
apiRoutes.forEach(([path, router]) => app.use(path, router));

/** ===================== Health Check ===================== */
app.get('/ping', catchSync(async(req : Request, res: Response)=> {
    let response = ResponseException("Service en ligne").Success();
    res.status(response.status).json({data:response.data});
}));

/** ===================== 404 Handler ===================== */
app.use(/(.*)/, catchSync(async(req : Request, res: Response) => {
    let response = ResponseException("Chemin ou méthode non supporté.").NotFound();
    res.status(response.status).json({data:response.data});
}))

/** ===================== Global Error Handler ===================== */
app.use(ResponseProtocole);

export default app;
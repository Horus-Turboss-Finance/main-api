import winston from "winston";
import path from "path";

import 'winston-daily-rotate-file';

// Configuration centrale de Winston pour logger les événements application et erreurs
const logDir = path.join(__dirname, "../../logs");

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({level : 'info', format: winston.format.printf(info => `[${info.level.toUpperCase()}] ${info.message}`)}),
    new winston.transports.DailyRotateFile({ filename: path.join(logDir, "error-%DATE%.log"), level: "error",
  maxFiles: 14, }),
    new winston.transports.DailyRotateFile({ filename: path.join(logDir, "combined-%DATE%.log"),
  maxFiles: 14, }),
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({ filename: path.join(logDir, "exceptions-%DATE%.log"),  maxFiles: 14, })
  ]
});
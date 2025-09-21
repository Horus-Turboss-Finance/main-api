import { ResponseException } from '../middleware/responseException';
import { catchSync } from '../middleware/catchError';
import express, { Request, Response } from 'express';
import client from "prom-client";

/**
 * Endpoint pour exposer les métriques Prometheus
 */
export default express.Router().get("/", catchSync(async (req: Request, res: Response) => {
  let metrics = await client.register.getMetricsAsJSON();
  
  let clientResponse = ResponseException(JSON.stringify(metrics)).Success()
  res.status(clientResponse.status).json(clientResponse);
}));
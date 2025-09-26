import { ResponseException } from '../middleware/responseException';
import { catchSync } from '../middleware/catchError';
import express, { RequestHandler } from 'express';
import client from "prom-client";

/**
 * Endpoint pour exposer les métriques Prometheus
 */
export default express.Router().get("/", catchSync(async (req, res) => {
  const metrics = await client.register.getMetricsAsJSON();
  
  const clientResponse = ResponseException(JSON.stringify(metrics)).Success()
  res.status(clientResponse.status).json(clientResponse);
}) as RequestHandler);
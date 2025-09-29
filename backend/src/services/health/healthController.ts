import { Request, Response } from 'express';

export const getHealth = async (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

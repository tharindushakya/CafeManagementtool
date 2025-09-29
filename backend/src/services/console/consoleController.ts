import { Request, Response } from 'express';

// Simple in-memory mapping for console sessions -> user
const consoleBindings: Map<string, string> = new Map();

export const linkConsole = async (req: Request, res: Response) => {
  const { token, userId } = req.body as any;
  if (!token || !userId) return res.status(400).json({ error: 'missing_token_or_user' });
  // In production this would verify a signed token; here we accept any token
  consoleBindings.set(token, userId);
  return res.status(200).json({ linked: true, token, userId });
};

export const getConsoleLink = async (req: Request, res: Response) => {
  const token = req.params.token;
  const userId = consoleBindings.get(token);
  if (!userId) return res.status(404).json({ linked: false });
  return res.json({ linked: true, userId });
};

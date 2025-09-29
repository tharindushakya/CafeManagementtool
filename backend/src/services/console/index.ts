import express from 'express';
import { linkConsole, getConsoleLink } from './consoleController';

export function createConsoleRouter() {
  const router = express.Router();
  router.post('/consoles/link', linkConsole);
  router.get('/consoles/link/:token', getConsoleLink);
  return router;
}

export default createConsoleRouter;

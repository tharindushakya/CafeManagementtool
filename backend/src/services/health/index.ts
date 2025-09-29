import express from 'express';
import { getHealth } from './healthController';

export function createHealthRouter() {
  const router = express.Router();
  router.get('/health', getHealth);
  return router;
}

// Simple server entry for manual testing
if (require.main === module) {
  const app = express();
  app.use('/', createHealthRouter());
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Health server listening on ${port}`));
}

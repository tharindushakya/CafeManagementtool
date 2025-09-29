import express from 'express';
import bodyParser from 'body-parser';
import { createHealthRouter } from './services/health';
import createBookingRouter from './services/booking';
import createDeviceRouter from './services/device';
import createPaymentsRouter from './services/payments';
import createTelemetryRouter from './services/telemetry';

export function createApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use('/', createHealthRouter());
  app.use('/', createBookingRouter());
  app.use('/', createDeviceRouter());
  app.use('/', createPaymentsRouter());
  app.use('/', createTelemetryRouter());
  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const app = createApp();
  app.listen(port, () => console.log(`App listening on ${port}`));
}

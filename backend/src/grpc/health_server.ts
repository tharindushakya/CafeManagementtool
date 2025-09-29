// Minimal gRPC health server stub. This file uses @grpc/grpc-js in production.

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../specs/001-description-baseline-specification/contracts/service.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

// Assumes a service named HealthService with Check rpc exists in the proto; this is a safe stub until proto is expanded.
function check(call: any, callback: any) {
  callback(null, { status: 'SERVING' });
}

export function startGrpcHealthServer(port = 50051) {
  const server = new grpc.Server();
  // If the proto contains health service, wire it; otherwise this is a noop that prevents startup errors in test mode.
  try {
    const healthService = grpcObj.HealthService?.service ?? grpcObj.health?.Health?.service;
    if (healthService) {
      server.addService(healthService, { Check: check });
    }
  } catch (err) {
    console.warn('gRPC health proto not found or malformed; starting empty server stub', err);
  }

  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, _port) => {
    if (err) throw err;
    server.start();
    console.log(`gRPC health server started on ${port}`);
  });
  return server;
}

if (require.main === module) {
  startGrpcHealthServer();
}

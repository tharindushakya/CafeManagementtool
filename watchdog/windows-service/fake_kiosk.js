// Simple fake kiosk that prints a heartbeat every 200ms and exits when it receives SIGTERM
setInterval(() => {
  console.log('kiosk: heartbeat');
}, 200);

process.on('SIGTERM', () => {
  console.log('kiosk: received SIGTERM, exiting');
  process.exit(0);
});

// keep alive
setTimeout(() => {
  console.log('kiosk: done');
  process.exit(0);
}, 60000);

const vm = require('vm');

function runPlugin(code, context = {}, timeout = 1000) {
  // create a safe-ish sandbox
  const sandbox = { console: { log: () => {} }, exports: {}, module: { exports: {} }, ...context };
  const script = new vm.Script(code, { filename: 'plugin.js' });
  const ctx = vm.createContext(sandbox);
  script.runInContext(ctx, { timeout });
  return ctx.module.exports || ctx.exports;
}

module.exports = { runPlugin };

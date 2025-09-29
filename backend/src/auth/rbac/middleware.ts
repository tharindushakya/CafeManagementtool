import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

type Policy = {
  path: string;
  methods: string[];
  allow: string[];
};

let policies: Policy[] = [];

export function loadPolicies(policyPath?: string) {
  const p = policyPath || path.join(__dirname, 'policies.yaml');
  if (!fs.existsSync(p)) return;
  const yaml = fs.readFileSync(p, 'utf8');
  // very small YAML parser for our simple structure (avoid extra deps)
  const lines = yaml.split(/\r?\n/).map(l => l.trim());
  const result: Policy[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith('- path:')) {
      const pathVal = l.replace('- path:', '').trim().replace(/"/g, '');
      const methodsLine = lines[++i];
      const allowLine = lines[++i];
      const methodsMatch = methodsLine.match(/methods:\s*\[(.*)\]/);
      const allowMatch = allowLine.match(/allow:\s*\[(.*)\]/);
      const methods = methodsMatch ? methodsMatch[1].split(',').map(s => s.trim().replace(/"/g, '')) : [];
      const allow = allowMatch ? allowMatch[1].split(',').map(s => s.trim().replace(/"/g, '')) : [];
      result.push({ path: pathVal, methods, allow });
    }
  }
  policies = result;
}

function matchPath(pattern: string, actual: string) {
  if (pattern.endsWith('/*')) {
    const base = pattern.slice(0, -2);
    return actual.startsWith(base);
  }
  return pattern === actual;
}

export function rbacMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const role = (req as any).authRole || 'operator'; // default for dev
    for (const p of policies) {
      if (matchPath(p.path, req.path) && p.methods.includes(req.method)) {
        if (p.allow.includes(role)) return next();
        return res.status(403).json({ error: 'forbidden' });
      }
    }
    // no policy matched -> default allow
    return next();
  } catch (e) {
    return res.status(500).json({ error: 'rbac error' });
  }
}

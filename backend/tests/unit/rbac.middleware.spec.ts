import { rbacMiddleware, loadPolicies } from '../../src/auth/rbac/middleware';

function makeReq(path: string, method = 'GET', role?: string) {
  const req: any = { path, method };
  if (role) req.authRole = role;
  return req;
}

function makeRes() {
  const res: any = {};
  res.status = (code: number) => { res._status = code; return res; };
  res.json = (body: any) => { res._body = body; return res; };
  return res;
}

describe('RBAC middleware', () => {
  beforeAll(() => {
    loadPolicies();
  });

  test('admin can access /admin/resource', (done) => {
    const req: any = makeReq('/admin/resource', 'GET', 'admin');
    const res: any = makeRes();
    rbacMiddleware(req, res, () => { done(); });
  });

  test('operator cannot POST /payments/create', (done) => {
    const req: any = makeReq('/payments/create', 'POST', 'operator');
    const res: any = makeRes();
    rbacMiddleware(req, res, () => { /* should not call next */ done(new Error('allowed unexpectedly')); });
    expect(res._status).toBe(403);
    done();
  });
});

import { register } from '@/database/auth/register';
import type { RouteController } from '@/models/app.model';
import type { RegisterRoute } from '@/openapi/auth/register';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';

const registerController: RouteController<RegisterRoute> = async (c) => {
  const { name, surname, password } = await c.req.valid('json');
  const registerRes = await register(name, surname, password);
  if (!registerRes.success) {
    const text =
      registerRes.error === 500
        ? 'Internal server error'
        : 'User already exists';
    return c.json(createErrorResult(text), registerRes.error as 500 | 409);
  }
  return c.json(createSuccessResult(null), 200);
};

export default registerController;

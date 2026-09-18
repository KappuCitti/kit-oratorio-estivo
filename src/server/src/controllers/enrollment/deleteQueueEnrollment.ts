import { deleteQueueEnrollment } from '@/database/enrollment/deleteQueueEnrollment';
import type { RouteController } from '@/models/app.model';
import type { DeleteQueueEnrollmentRoute } from '@/openapi/enrollment/deleteQueueEnrollment';
import { httpSuccessResponse } from '@/utils/responses';

const deleteQueueEnrollmentController: RouteController<
  DeleteQueueEnrollmentRoute
> = async (c) => {
  const { id } = await c.req.valid('param');
  await deleteQueueEnrollment(id);
  return httpSuccessResponse(c, null);
};

export default deleteQueueEnrollmentController;

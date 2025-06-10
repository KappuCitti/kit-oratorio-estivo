import { approveEnrollment } from '@/database/enrollment/approveEnrollment';
import type { RouteController } from '@/models/app.model';
import type { ApproveEnrollmentRoute } from '@/openapi/enrollment/approveEnrollment';
import { httpSuccessResponse } from '@/utils/responses';

const approveEnrollmentController: RouteController<
  ApproveEnrollmentRoute
> = async (c) => {
  const { queueId, managerNotes, section, weeks, teamId } = await c.req.valid(
    'json'
  );
  const enrollment = await approveEnrollment(
    queueId,
    section,
    weeks,
    teamId,
    managerNotes
  );
  return httpSuccessResponse(c, enrollment);
};

export default approveEnrollmentController;

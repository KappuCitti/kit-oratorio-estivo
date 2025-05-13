import { createErrorResult } from '@/utils/createResult';
import { getUserFromToken } from '../getFromToken';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '@/database/logger';

export async function addManagedUser(
  token: string,
  name: string,
  surname: string,
  email: string,
  birthDate: Date,
  birthPlace: string,
  sex: string,
  street: string,
  city: string,
  postalCode: string,
  country: string,
  role: string
) {
  try {
    const user = await getUserFromToken(token);
    if (!user.success)
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  } catch (error) {
    dbLogger.error(error);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

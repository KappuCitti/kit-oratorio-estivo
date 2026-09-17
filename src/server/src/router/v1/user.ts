import createFamilyController from '@/controllers/user/admin/createFamily';
import createUserController from '@/controllers/user/admin/createUser';
import createUsersController from '@/controllers/user/admin/createUsers';
import deletePersonController from '@/controllers/user/admin/deletePerson';
import getPeopleController from '@/controllers/user/admin/getPeople';
import getPersonController from '@/controllers/user/admin/getPerson';
import updatePersonController from '@/controllers/user/admin/updatePerson';
import changePasswordController from '@/controllers/user/changePassword';
import changeThemeController from '@/controllers/user/changeTheme';
import getSelfInfoController from '@/controllers/user/getSelfInfo';
import addManagedUserController from '@/controllers/user/managed/addManagedUser';
import getManagedUsersController from '@/controllers/user/managed/getManagedUsers';
import { changePasswordRouteDef } from '@/openapi/user/changePassword';
import { changeUserThemeRouteDef } from '@/openapi/user/changeTheme';
import { createUserRouteDef } from '@/openapi/user/createUser';
import { createUsersRouteDef } from '@/openapi/user/createUsers';
import { getManagedUserListRouteDef } from '@/openapi/user/getManagedUsers';
import { getSelfInfoRouteDef } from '@/openapi/user/getSelfInfo';
import { registerManagedUserRouteDef } from '@/openapi/user/registerManagedUser';
import { createFamilyRouteDef } from '@/openapi/user/admin/createFamily';
import { deletePersonRouteDef } from '@/openapi/user/admin/deletePerson';
import { getPeopleRouteDef } from '@/openapi/user/admin/getPeople';
import { getPersonRouteDef } from '@/openapi/user/admin/getPerson';
import { updatePersonRouteDef } from '@/openapi/user/admin/updatePerson';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(createUsersRouteDef, createUsersController)
  .openapi(getSelfInfoRouteDef, getSelfInfoController)
  // Self
  .openapi(changePasswordRouteDef, changePasswordController)
  .openapi(changeUserThemeRouteDef, changeThemeController)
  // Managed
  .openapi(registerManagedUserRouteDef, addManagedUserController)
  .openapi(getManagedUserListRouteDef, getManagedUsersController)
  .openapi(createUserRouteDef, createUserController)
  // Rubrica: elenco con ricerca, dettaglio con le relazioni, modifica,
  // eliminazione e creazione di un nucleo familiare. Prima il client chiamava
  // /people, /childs, /parents e POST /family, che non sono mai esistiti.
  .openapi(getPeopleRouteDef, getPeopleController)
  .openapi(getPersonRouteDef, getPersonController)
  .openapi(updatePersonRouteDef, updatePersonController)
  .openapi(deletePersonRouteDef, deletePersonController)
  .openapi(createFamilyRouteDef, createFamilyController);

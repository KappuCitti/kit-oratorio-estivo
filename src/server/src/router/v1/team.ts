import createTeamController from '@/controllers/team/createTeam';
import deleteTeamController from '@/controllers/team/deleteTeam';
import editTeamController from '@/controllers/team/editTeam';
import getTeamsController from '@/controllers/team/getTeamList';
import { createTeamRouteDef } from '@/openapi/team/createTeam';
import { deleteTeamRouteDef } from '@/openapi/team/deleteTeam';
import { editTeamRouteDef } from '@/openapi/team/editTeam';
import { getTeamListRouteDef } from '@/openapi/team/getTeams';
import { createRouter } from '@/utils/createRouter';

// Le registrazioni sono concatenate perche' `.openapi()` restituisce un tipo
// che include la rotta appena aggiunta: interrompendo la catena quel tipo si
// perde, e con lui la tipizzazione end-to-end che usa il client.
export default createRouter()
  .openapi(getTeamListRouteDef, getTeamsController)
  .openapi(createTeamRouteDef, createTeamController)
  .openapi(deleteTeamRouteDef, deleteTeamController)
  .openapi(editTeamRouteDef, editTeamController);

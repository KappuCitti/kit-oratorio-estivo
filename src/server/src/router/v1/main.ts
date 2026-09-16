import mainController from '@/controllers/main';
import { mainRouteDef } from '@/openapi/main';
import { createRouter } from '@/utils/createRouter';

export default createRouter().openapi(mainRouteDef, mainController);

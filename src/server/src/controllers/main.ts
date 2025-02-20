import type { RouteController } from "@/models/app.model";
import type { MainRoute } from "@/openapi/main";

const mainController: RouteController<MainRoute> = (c) => {
  return c.json({
    name: "API Server - Kit Oratorio Estivo",
    version: "1.0.0",
  });
};

export default mainController;
import {taskRoutes} from "./task.route";
import { Express } from "express";
import {RouteUser} from "./user.route";
import * as authMiddleware from "../middlewares/auth.middleware";

const RouteVersion1 = (app:Express) :void => {
  const version:String="/api/v1";
  app.use(version + "/tasks",authMiddleware.requireAuth,taskRoutes);
  app.use(version + "/user",RouteUser)
};

export default RouteVersion1;

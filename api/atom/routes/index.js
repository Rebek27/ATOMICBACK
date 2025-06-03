import { Router } from "express";
import config from "../../../src/config/config.js";

import userRoutes from "./user.routes.js";
import eventsRoutes from "./events.routes.js";
import taskRoutes from "./task.routes.js";
const routerAPI = (app) =>{
    const router = Router();
    const api = config.API_URL;
    app.use(api,router);
    //Router
    router.use('',userRoutes);
    router.use('',eventsRoutes);
    router.use('',taskRoutes);
    return router;
}

export default routerAPI; // ✅
import { Router } from "express";
import config from "../../../config/config";

import userRoutes from "./user.routes";
import taskRoutes from "./task.routes";
const routerAPI = (app) =>{
    const router = Router();
    const api = config.API_URL;
    app.use(api,router);
    //Router
    router.use('',userRoutes);
    router.use('',taskRoutes);
    return router;
}

module.exports = routerAPI;
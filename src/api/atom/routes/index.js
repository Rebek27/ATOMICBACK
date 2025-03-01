import { Router } from "express";
import config from "../../../config/config";

import userRoutes from "./user.routes";

const routerAPI = (app) =>{
    const router = Router();
    const api = config.API_URL;
    app.use(api,router);
    //Router
    router.use('',userRoutes);
    return router;
}

module.exports = routerAPI;
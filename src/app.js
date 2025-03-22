import morgan from "morgan";
import express from "express";
import cors from "cors";
import routeAPI from "./api/atom/routes/index"
import config from "./config/config";

const app = express();

import { mongoose } from "./config/database.config";

app.set('port',config.PORT);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const api = config.API_URL;
app.get(`${api}`, (req,res)=>{
    res.send(
        `<h1>RESTful running in root</h1> <p> atomic: <b>${api}/api-docs</b> for more information.</p>`
    );
})
app.get('/atomic', (req,res)=>{
    res.send(
        `<h1>RESTful running in YVAN</h1> <p> eCommerce: <b>${api}/api-docs</b> for more information.</p>`
    );
})
// Routes routeAPI(app);
routeAPI(app);
// Swagger Docs
// Middleware para el manejo de errores
// Export App
export default app;
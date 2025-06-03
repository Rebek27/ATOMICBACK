import express from "express";
import serverless from "serverless-http";
import morgan from "morgan";
import cors from "cors";
import routeAPI from "../src/api/atom/routes/index.js";
import config from "../src/config/config.js";
import { mongoose } from "../src/config/database.config.js";

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const api = config.API_URL || "/api";
app.get(`${api}`, (req, res) => {
  res.send(`<h1>RESTful running in root</h1> <p> atomic: <b>${api}/api-docs</b></p>`);
});
app.get('/atomic', (req, res) => {
  res.send(`<h1>RESTful running in YVAN</h1> <p> eCommerce: <b>${api}/api-docs</b></p>`);
});

routeAPI(app);

export const handler = serverless(app);

import express from "express";
import cors from "cors";

import UbicacionesRoute from './routes/ubicaciones.router.js';
import UsuariosRoute from './routes/usuarios.api.routes.js';
//import path from "path"; //modulo de node

const app = express();
app.set("view engine", "ejs")


app.use(express.json()); // esto es para poder enviar un json por medio de apis
app.use(cors());




app.use('/', UbicacionesRoute)
app.use('/', UsuariosRoute)

export default app;

import express from "express";
import cors from "cors";
import PecesRoute from './api/routes/peces.routes.js';
import NudosRoute from './api/routes/nudos.routes.js';
import UbicacionesRoute from './api/routes/ubicaciones.router.js';
import UsuariosRoute from './api/routes/usuarios.api.routes.js';
//import path from "path"; //modulo de node

const app = express();
app.set("view engine", "ejs")


app.use(express.urlencoded({ extended: true }))
app.use("/", express.static("public"))
app.use(express.json()); // esto es para poder enviar un json por medio de apis
app.use(cors());
app.use(express.static('public'));


app.use(PecesRoute);
app.use(NudosRoute);
app.use(UbicacionesRoute);
app.use(UsuariosRoute)

// PUERTO ----------------------------//
app.listen(2022, function() {
    console.log("Arrancó el servidor")
    console.log('http://localhost:2022')
})
// modulo de rutas //
// requiere importar express y controladores
import express from 'express'
import * as UbicacionesController from "../controllers/ubicaciones.controller.js";
// creamos una ruta
const route = express.Router();
//import {estaLogeado} from "../../middleware/auth.middleware.js";


// ruta + nombre del controlador //
route.get('/api/ubicaciones', UbicacionesController.verUbicaciones)
route.get('/api/ubicacion/:id/ver', UbicacionesController.verUbicacion)
// dos acciones

export default route
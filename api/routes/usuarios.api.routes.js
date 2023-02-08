import express from 'express'
import * as UsuariosApiController from '../controllers/usuarios.api.controllers.js'
//import {isLoginValid} from '../../middleware/userValid.middleware.js';
import multer from 'multer';
import sharp from "sharp"


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, '../front-end/src/assets/')
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
});

const uploadFile = multer({storage: storage});

const resizeImage = (req,res,next) => {

    if(req.files){
      sharp(req.files[0].path)
      .resize(200,200)
      .toFile('../front-end/src/assets/imgSmall/' + req.files[0].originalname)
        .then(() => next())
        .catch(e => res.status(500).json({mensaje: "no se puedo redimencionar"}))
    }else{
      next();
    }
  }
 
const route = express.Router()

//---URI--> acciones masivas
route.route('/api/usuarios')
    .get(UsuariosApiController.findAll)
    .post(UsuariosApiController.create)


//---URI--> acciones sobre un elemento en particular----//
route.route('/api/usuarios/:id')
    .get(UsuariosApiController.findById)
    .patch(UsuariosApiController.editById)
    .delete(UsuariosApiController.deleteById)

//---URI--> login
route.route('/api/usuarios/login')
     //es un post por que creamos la sesión o login
    .post(UsuariosApiController.login)
//---URI--> logout

route.route('/api/usuarios/logout')
    .post(UsuariosApiController.logout)

route.route('/api/enviarmail')
    .post(UsuariosApiController.sendMails)


route.post('/api/usuarios/:id/foto', [uploadFile.any(), resizeImage], UsuariosApiController.colocarImagen)

route.get('/api/imagenes/:idUsuario', UsuariosApiController.verImagenUsuario)

export default route
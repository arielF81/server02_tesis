import * as UsuariosServices from "../services/usuarios.services.js"
import * as tokenServicio from '../services/token.services.js'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


//traer todos o filtrar por nombre
function findAll(req, res) {
    const filter = {   
    }
   if (req.query.nombre) {
    filter.nombre = req.query.nombre
    }
    
    UsuariosServices.traerUsuarios(filter)
        .then(function (usuarios) {
           
            res.status(200).json(usuarios)
        })
}

//agregar uno nuevo
function create(req, res) {
    const usuario = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        preferencias: req.body.preferencias
    }
    
    if(usuario.preferencias == null) {
        usuario.preferencias = {
            agua: "Sin preferencias",
            nivel: "Sin preferencias",
            pez: "Sin preferencias"
        }
    }
    
    /*if(usuario.preferencias == {}){

        res.json({mensaje: "Te aconsejamos completar los datos de tus preferencias"})

        let nivel = "Sin datos aún";
        let agua = "Sin datos aún";
        let pez = "Sin datos aún";

        usuario = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password,
            preferencias:
            {
                nivel,
                agua,
                pez
            } 
        }
    }else{
        res.status(400).json({mensaje: "no se pudo guardar un coño"})
    }*/
    UsuariosServices.guardarUsuario(usuario)
        .then(function (nuevoUsuario) {
            res.status(201).json(nuevoUsuario)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

//Obtener un usuario en particular
function findById(req, res) {
    const id = req.params.id

    UsuariosServices.traerUsuarioPorID(id)
        .then(function (usuario) {
            if (usuario) {
                res.status(200).json(usuario)
            } else {
                res.status(404).json({ message: "Usuario no encontrado" })
            }
        })
       
}


function deleteById(req, res) {
    const id = req.params.id

    UsuariosServices.eliminarUsuario(id)
        .then(function (usuario) {
            if (usuario) {
                res.status(200).json({ message: "Usuario eliminado con exito" })
            } else {
                res.status(404).json({ message: "Usuario no encontrado" })
            }
        }) 
}

//editar 
function editById(req, res) {
    const id = req.params.id 
    const usuario = {};

    if (req.body.nombre) {
        usuario.nombre = req.body.nombre
    }

    if(req.body.preferencias){
        usuario.preferencias = req.body.preferencias;
    }
    UsuariosServices.editarUsuario(id, usuario)
        .then(function (usuario) {
            if (usuario) {
                res.status(200).json({ message: "Usuario editado con exito" })
            } else {
                res.status(404).json({ message: "Usuario no encontrado" })
            }
        })
}


// login----token-------------------///
//Se divide en 3 partes: Header, Payload (info del usuario) y Verify Signature
function login(req, res) {
    UsuariosServices.login(req.body)
        .then(usuario => {
            //genero el token 
           const token = jwt.sign({ id: usuario._id, password: usuario.password, email: usuario.email }, 'VERIFY_SIGNATURE')
           tokenServicio.create({ token })
           //le devuelvo el token al usuario
            res.status(201).json({ token, usuario })

        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
}

function logout(req, res) {
    
        const token = req.headers['auth-token']
    
        tokenServicio.deleteByToken(token)
    
        res.json({ message: 'La sesión se cerró correctamente' })
    
    }

function sendMails (req, res) {

        if(req.body.email == '' && req.body.email.lenght == 0) {
            throw new Error('Tienes que poner tu email')
        }
        if(req.body.nombre == '' && req.body.nombre.lenght == 0) {
            throw new Error('Tienes que poner tu nombre')
        }
        if(req.body.mensaje == '' && req.body.mensaje.lenght == 0) {
            throw new Error('Tienes que poner un mensaje')
        }
    
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "jose.diazp@davinci.edu.ar",
                pass: "yswtrlcwfrultlsb",
            }
        }
        const trasnport = nodemailer.createTransport(config)
    
        const mensaje = {
            from: req.body.email,
            to: "josefideldelpino@gmail.com", // este es el mail al que le llegare mi mail
            subject: req.body.nombre,
            text: req.body.mensaje // este es el mensaje que llegara
        }
    
        trasnport.sendMail(mensaje, (err, info) => {
            if(err) {
                res.status(500).json({mensaje: "no se pudo enviar el mail"})
                throw new Error('no se pudo enviar el mail')
            }else{
                console.log("email enviado")
                res.status(200).json(req.body)
            }
        })
    
}

async function colocarImagen(req, res) {
    const idUsuario = req.params.id
    const [originalname] = req.files
    UsuariosServices.imagenesUsuario(idUsuario, originalname.originalname)
    .then(() => res.status(201).json({mensaje: "se coloco la imagen correctamente"}))
    .catch(() => res.status(500).json({mensaje: "hubo un error, no se pudo colocar la imagen"}))
}
async function verImagenUsuario(req,res){
    const idUsuario = req.params.idUsuario;
    console.log(idUsuario);

    UsuariosServices.verImagen(idUsuario)
    .then(datos => res.status(200).json({datos}))
    .catch(e => res.status(404).json({mensaje: "no se encontro la imagen de tu perfil"}))
}

export {
    findAll, 
    create,
    findById,
    deleteById,
    login, 
    logout,
    editById,
    sendMails,
    colocarImagen,
    verImagenUsuario
}
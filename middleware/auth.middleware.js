import jwt from "jsonwebtoken"
import * as usuarioServicio from '../api/services/usuarios.services.js';
import * as tokenServicio from '../api/services/token.services.js';
// tiene los mismos parametros que un controlador más
//la funcioón next llama al siguiente middleware o al controlador
function estaLogeado(req, res, next) {

    const token = req.headers['auth-token']

    if (!token) {
        return res.status(401).json({ message: 'No se envio un token' })        
    }

    try {
        const payload = jwt.verify(token, 'VERIFY_SIGNATURE')
        //busco el token en la base
        tokenServicio.findByToken(token)
            .then(tokenFound => {
                if (!tokenFound) {
                    return res.status(401).json({ message: 'Token invalido' })
                }
        //si encuentra el token, busca el usuario
                usuarioServicio.traerUsuarioPorID(payload.id)
                .then(usuario => {
                req.usuario = usuario
                next()
                 })

            })

        
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' })     
    }
    
}


export {
    estaLogeado
}
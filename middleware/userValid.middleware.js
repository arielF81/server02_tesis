import {loginScheme} from '../schemas/login.schema.js';
function isLoginValid(req, res, next) {
    loginScheme.validate(req.body, {abortEarly:false})
    .then(data => {
        req.body = data;
        next();
    })
    .catch(err => {
        res.status(400).json({errores: err.errors})
    })
}

export {
    isLoginValid
}
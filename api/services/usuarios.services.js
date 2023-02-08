
import { MongoClient, ObjectId } from "mongodb"
import bcrypt from 'bcrypt'

const client = new MongoClient("mongodb+srv://biufort2022:kmfdm666@cluster0.qqytoqz.mongodb.net/?retryWrites=true&w=majority")


async function traerUsuarios(filter) {
    return client.connect()
    .then(async function () {
        const db = client.db("Biufort") 
        return db.collection("usuarios").find(filter).toArray()
    })
}


async function guardarUsuario(usuario) {
   const newUsuario ={...usuario }
   const usuarioExiste = await client.db('Biufort').collection('usuarios').findOne({ email: newUsuario.email })
   if (usuarioExiste) {
    //si al traerlo existe disparo una ecepción
        throw new Error('Existe una cuenta con ese email')
    } 
    const salt = await bcrypt.genSalt(10)
    newUsuario.password = await bcrypt.hash(newUsuario.password, salt) 
    return client.connect()   
        .then(function() { 
            return client.db('Biufort').collection('usuarios').insertOne(newUsuario)
        })
        .then(function (result) {
            return newUsuario
        })
}

async function traerUsuarioPorID(id) {
    return client.connect()
        .then(function () {
            const db = client.db('Biufort')
            return db.collection('usuarios').findOne({ _id: new ObjectId(id) })
        })
}

async function eliminarUsuario(id) {
    return client.connect()
        .then(function () {
            return client.db('Biufort').collection('usuarios').deleteOne({ _id: new ObjectId(id) })
        })
        .then(function () {
            return true
        })

}

async function editarUsuario(id , usuario) {
    return client.connect()
        .then(function () {
            return client.db('Biufort').collection('usuarios').updateOne({_id: new ObjectId(id)} , {$set: usuario})
        })
}

//-----login---------------------------///
async function login(usuarioLogin) {
    await client.connect()
    const usuario = await client.db('Biufort').collection('usuarios').findOne({ email: usuarioLogin.email })
    //traigo al usuario por email , si no existe disparo una ecepción
    if (!usuario) {
        throw new Error('Usuario no registrado')
    }
    //comparo el valor del pw del login contra el hash
    const isMatch = await bcrypt.compare(usuarioLogin.password, usuario.password)
    // si es false
    if (!isMatch) {
        throw new Error('Contraseña incorrecta')
    }
    return usuario
}
async function imagenesUsuario(idUsuario, imagen){
    return client.connect()
    .then(async () => client.db('Biufort').collection('imagenes').insertOne({idUsuario: new ObjectId(idUsuario), imagen})
                    .then(imagen => imagen)
                    .catch(() => [])
    )
}
async function verImagen(usuarioId){
    return client.connect()
    .then(async () => client.db('Biufort').collection('imagenes').findOne({idUsuario: new ObjectId(usuarioId)}))
}



export {
    traerUsuarios, 
    guardarUsuario, 
    traerUsuarioPorID, 
    eliminarUsuario,
    editarUsuario,
    login,
    imagenesUsuario,
    verImagen
}
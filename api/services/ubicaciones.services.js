//--TODAS LAS FUNCIONALIDADES DEL SERVICIO--//
//en la capa de servicio va todo lo relacionado a los datos
//manipula datos del json, etc
//importo la clase mongo client para luego crear al cliente
import { MongoClient, ObjectId } from "mongodb"

// crear al cliente para conectarse al servidor de mongoDB
//const client = new MongoClient("mongodb://127.0.0.1:27017")
const client = new MongoClient("mongodb+srv://biufort2022:kmfdm666@cluster0.qqytoqz.mongodb.net/?retryWrites=true&w=majority")

async function traerUbicaciones() {
    //ejecutar el cliente con la funcion asincrónica connect
    return client.connect()
    
.then(async function () {
    console.log("Conectado a MongoDB")
    const db = client.db("Biufort") 
    //genero y retorno la lista de alumnos
    return db.collection("Ubicaciones").find().toArray()
})
}

async function traerUbicacionPorID(id) {
    return client.connect()
        .then(function () {
            const db = client.db('Biufort')
            return db.collection('Ubicaciones').findOne({ _id: new ObjectId(id) })
        })

}

//guardarAlumnos no forma parte del modulo
export {
    traerUbicaciones, 
    traerUbicacionPorID,
}
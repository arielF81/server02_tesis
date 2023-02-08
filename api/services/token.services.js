import { MongoClient, ObjectId } from 'mongodb'
const client = new MongoClient("mongodb+srv://biufort2022:kmfdm666@cluster0.qqytoqz.mongodb.net/?retryWrites=true&w=majority")
const db = client.db("Biufort") 
const tokens = db.collection('tokens')

//crear token 
async function create(token) {
    await client.connect()

    console.log("conecto con la base")

    await tokens.insertOne(token)

    console.log("se creo el token ")
}

//buscar token
async function findByToken(token) {
    await client.connect()

    const tokenFound = await tokens.findOne({ token })
    return tokenFound
}

//eliminar token
async function deleteByToken(token) {
    return client.connect()
    .then(async () => tokens.deleteOne({ token: token })
    .then(() => console.log("se elimino el token"))
    )

}

export {
    create,
    findByToken,
    deleteByToken
}
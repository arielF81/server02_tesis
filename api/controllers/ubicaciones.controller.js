import * as UbicacionesServices from "../services/ubicaciones.services.js"


function verUbicaciones (req,res){
    UbicacionesServices.traerUbicaciones()
    .then(ubicaciones => res.status(200).json(ubicaciones))
    .catch(err => console.log(err))
}

function verUbicacion (req, res) {
        
        const id = req.params.id
    
        UbicacionesServices.traerUbicacionPorID(id)
            .then(ubicacion => {
                if (ubicacion) {
                    //res.render("Peces/ver", { pez })
                    res.status(200).json(ubicacion)
                } else {
                    res.render("404", { msj: "Pez no encontrado" })
                }
            })
    }

export {
    verUbicaciones,
    verUbicacion,
}
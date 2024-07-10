const express = require ('express')
const { getUsuarios,setUsuario, updateUsuario,deleteUsuario, insertarTransferencia, getTransferencias } = require('./db')
const app = express()

app.listen(3000, () => {
    console.log("App escuchando puerto 3000")
})

app.use(express.json())

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html")
})
//GET /USUARIOS
app.get('/usuarios', async (req,res) => {
    try {
        const response = await getUsuarios()
        res.send(response)
    }catch (error) {
        res.statusCode = 500
        res.json({
            error: 'Algo salio mal, intentalo nuevamente'
        })
    }
})

//POST /USUARIO
app.post("/usuarios", async (req,res) => {
    const payload = req.body
    console.log(payload)

    try{
        const response = await setUsuario(payload)

        res.send(response)
    } catch (error) {
        res.statusCode = 500
        res.json({
            message: 'Algo salio mal, intentalo nuevamente',
            error:error

        })
    }
})

app.put("/usuario", async (req,res) => {
    const { id} = req.query
    const payload = req.body
    payload.id = id

    try {
        const response = await updateUsuario(payload)

        res.send(response)
    } catch (error) {
        req.statusCode =500
        res.json({
            message: 'Algo salio mal, intentalo nuevamente',
            error: error
        })
    }
})

//delete /usuario
app.delete("/usuario", async (req,res) => {
    const payload = req.query
    try {
        const result = await deleteUsuario(payload)
        res.statusCode = 202
        res.json({message: "Usuario Eliminado"})
    } catch (error) {
        res.statusCode = 500
        res.json({ error: "algo salio mal, intentalo más tarde" })
    }
})

app.post("/transferencia", async (req,res) => {
    const payload = req.body;
    const fecha = new Date();
    payload.fecha = fecha; 

    try{
        if(payload.emisor |= payload.receptor)
        {
            const response = await insertarTransferencia(payload);
            res.send(response.rows);
        }
        else
        {
            res.statusCode = 400
            res.send({
                error: "No se puede transferir a la misma cuenta"
            })
        }
    }
    catch (error)
    {
        res.statusCode= 500;
        res.json({error: 'No fue posible ingresar la transferencia'});
    }
})

app.get("/transferencias", async (req,res) => {
    try{
        const result = await getTransferencias()

        res.send(result)
    } catch (error) {
        res.statusCode = 500
        res.json({error: 'Error en la base de datos'});
    }
})





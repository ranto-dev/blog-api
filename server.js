const express = require("express")
const connectBD = require("./config/db")
const dotenv = require("dotenv").config()

// connection à la base
connectBD()

const port = 5000
const app = express()

// Middleware pour traiter les données de la request
app.use(express.json())
app.use(express.urlencoded({ extends:false }))

app.use("/post", require("./routes/post.routes"))

// lancer le serveur
app.listen(port, () => {
    console.log("Le serveur est demarré au port " + port)
})
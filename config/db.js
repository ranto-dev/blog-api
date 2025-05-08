const mongoose = require("mongoose")

const connectBD = async () => {
    try {
        mongoose.set("strictQuery", false)
        mongoose.connect('mongodb://127.0.0.1:27017/post-api-nodejs')
            .then(() => console.log('Mongo Connecté avec success!'));
    } catch (err) {
        console.log(err)
        process.exit()
    }
}

module.exports = connectBD
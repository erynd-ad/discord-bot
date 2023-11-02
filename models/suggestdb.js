const mongoose = require('mongoose')

module.exports = mongoose.model('suggests', new mongoose.Schema({
    id: String,
    suggest: String,
    modality: String,
    owner: String
}))
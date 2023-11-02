const mongoose = require('mongoose')

module.exports = mongoose.model('tickets', new mongoose.Schema({
    id: String,
    owner: String,
    staff: String,
    type: String,
    status: Boolean
}))
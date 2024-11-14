const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',  // This correctly references the User model
    },
    name: {
        type: String,  // Define as a string
        required: true,
    },
    email: {
        type: String,  // Define as a string
        required: true,
    },
    role: {
        type: String,  // Define as a string
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiredAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: 86400,  // Set the expiration in seconds (24 hours = 86400 seconds)
        },
    },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;

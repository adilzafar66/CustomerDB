const mongoose = require('mongoose');
const Schema = mongoose.Schema;

settingsSchema = new Schema({
    enableEdit: {
        type: Boolean,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {timestamps: true, strict: false});

const UserDB = mongoose.connection.useDb('Users');
const Settings = UserDB.model('User', settingsSchema, 'settings');
module.exports = Settings;
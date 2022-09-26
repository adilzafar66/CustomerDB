const mongoose = require('mongoose');
const Schema = mongoose.Schema;

customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    userId: {
        type: String
    }
}, {timestamps: true});

const customerDB = mongoose.connection.useDb('Customers');
const Customer = customerDB.model('Customer', customerSchema, 'data');
module.exports = Customer;

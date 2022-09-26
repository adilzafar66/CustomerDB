const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    username: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters long']
    }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    if (!this.username) {
        this.username = this.email;
    }
    next();
});

userSchema.statics.login = async function(username, password){
    const user = await this.findOne({username});
    if (user) {
        const authenticate = await bcrypt.compare(password, user.password);
        if (authenticate) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error('Username does not exist');
}

const UserDB = mongoose.connection.useDb('Users');
const User = UserDB.model('User', userSchema, 'data');
module.exports = User;

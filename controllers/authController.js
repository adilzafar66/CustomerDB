const User = require('../models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utilsController');

function getSignup(req, res) {
	res.render('signup', utils.renderObj(req, 'Sign Up'));
}

function getLogin(req, res) {
	res.render('login', utils.renderObj(req, 'Log In'));
}

function getLogout(req, res) {
	res.cookie('jwt', '', {
		maxAge: 1
	});
	res.redirect('/login');
}

async function postSignup(req, res) {
	try {
		const user = await User.create(req.body);
		const token = utils.createToken(user._id);
		res.cookie('jwt', token, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000
		});
		res.status(200).json({
			user: user._id
		});
	} catch (error) {
		const errors = handleErrors(error);
		res.status(400).json({
			errors
		});
		console.log(errors);
	}
}

async function postLogin(req, res) {
	const { username, password } = req.body;
	try {
		const user = await User.login(username, password);
		const token = utils.createToken(user._id);
		res.cookie('jwt', token, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000
		});
		res.status(200).json({
			user: user._id
		});
	} catch (error) {
		res.status(400).json();
	}
}

function handleErrors(err) {
	let errors = {
		name: '',
		email: '',
		username: '',
		password: ''
	};
	if (err.message.toLowerCase().includes('user validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}
	if (err.code === 11000) {
		errors.email = 'An account already exists with that email';
	}
	return errors;
}

module.exports = {
	getSignup,
	postSignup,
	getLogin,
	postLogin,
	getLogout
};

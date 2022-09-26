const User = require('../models/user');
const Customer = require('../models/customer');
const Settings = require('../models/settings');
const utils = require('./utilsController');

async function getAccount(req, res) {
	if (utils.getDecodedToken(req)) {
		res.render('account/account', utils.renderObj(req, 'Account'));
	} else {
		res.redirect('/login');
	}
}

async function getProfile(req, res) {
	const decodedToken = utils.getDecodedToken(req);
	const user = await User.findById(decodedToken.userId);
	const customers = await Customer.find(decodedToken);
	res.render('account/profile', { user, customers });
}

async function getSettings(req, res) {
	const decodedToken = utils.getDecodedToken(req);
	const query = { userId: decodedToken.userId };
	const settings = await Settings.findOne(query);
	res.render('account/settings', { settings });
}

async function getSettingsJSON(req, res) {
	const decodedToken = utils.getDecodedToken(req);
	const query = { userId: decodedToken.userId };
	const settings = await Settings.findOne(query);
	res.send(settings);
}

async function putSettings(req, res) {
	try {
		const decodedToken = utils.getDecodedToken(req);
		const query = { userId: decodedToken.userId };
		const options = { upsert: true, new: true, setDefaultsOnInsert: true };
		const settings = await Settings.findOneAndUpdate(query, req.body, options);
		res.send(settings);
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getAccount,
	getProfile,
	getSettings,
	getSettingsJSON,
	putSettings
};

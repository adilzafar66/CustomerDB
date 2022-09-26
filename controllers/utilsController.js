const jwt = require('jsonwebtoken');

function error404Get(req, res) {
	res.status(404).render('404', renderObj(req, '404'));
}

function userIdGet(req, res) {
	try {
		const decodedToken = getDecodedToken(req);
		res.status(200).send(decodedToken);
	} catch (error) {
		console.log(error);
	}
}

function getLoginElemData(decodedToken) {
	if (decodedToken) {
		return { url: '/logout', text: 'Logout' };
	}

	return { url: '/login', text: 'Login' };
}

function getSignupElemData(decodedToken) {
	if (decodedToken) {
		return { url: '/account', text: 'My Account' };
	}

	return { url: '/signup', text: 'Sign Up' };
}

function createToken(userId) {
	return jwt.sign({ userId }, 'cogitoergosum', {
		expiresIn: 24 * 60 * 60
	});
}

function getDecodedToken(req) {
	try {
		const token = req.cookies.jwt;
		return jwt.verify(token, 'cogitoergosum');
	} catch (error) {
		console.log(error);
	}
}

function renderObj(req, title) {
	const decodedToken = getDecodedToken(req);
	const login = getLoginElemData(decodedToken);
	const signup = getSignupElemData(decodedToken);

	return {
		title: title,
		login: login,
		signup: signup
	};
}

module.exports = {
	error404Get,
	userIdGet,
	getLoginElemData,
	getSignupElemData,
	createToken,
	getDecodedToken,
	renderObj
};

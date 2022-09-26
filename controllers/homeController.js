const utils = require('./utilsController');

function homeGet(req, res) {
	res.render('home', utils.renderObj(req, 'home'));
}

module.exports = {
	homeGet
};

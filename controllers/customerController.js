const Customer = require('../models/customer');
const utils = require('./utilsController');

async function customersGet(req, res) {
	try {
		const customers = await Customer.find(utils.getDecodedToken(req));
		const objParam = utils.renderObj(req, 'Customers');
		res.render('customers/customers', Object.assign({ customers }, objParam));
	} catch (error) {
		console.log(error);
	}
}

async function customersGetAsync(req, res) {
	try {
		const customers = await Customer.find(utils.getDecodedToken(req));
		res.render('customers/customer-table', { customers });
	} catch (error) {
		console.log(error);
	}
}

async function customersPost(req, res) {
	try {
		const customers = await Customer.create(req.body);
		res.send(customers);
	} catch (error) {
		console.log(error);
	}
}

async function customersPut(req, res) {
	try {
		const id = req.params.id;
		const customer = await Customer.findByIdAndUpdate(id, req.body);
		res.send(customer);
	} catch (error) {
		console.log(error);
	}
}

async function customersDelete(req, res) {
	try {
		const id = req.params.id;
		const customer = await Customer.findByIdAndDelete(id);
		res.send(customer);
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	customersGet,
	customersGetAsync,
	customersDelete,
	customersPost,
	customersPut
};

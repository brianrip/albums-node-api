const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

// load environment
const environment = process.env.NODE_ENV || 'local';
const config = require('./config/config')[environment];
if (config.environment != 'test') console.log('Using Environment: ' + config.environment);

// setup Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.database, (err) => {
	if (err) throw err;

	if (config.environment != 'test') console.log('Mongoose connection successful.');
});

// register each model with Mongoose
const modelsDir = path.resolve(__dirname + '/models/');
fs.readdirSync(modelsDir).forEach((file) => {
	if(file.substr(-3) == '.js') {
		const filePath = path.join(modelsDir, file);
		require(filePath)(config, mongoose);
	}
});

// import data from csv - will only import if data is new
const importAlbums = require('./import-albums');
importAlbums(mongoose);

// setup Express
const app = express();
if (config.environment !== 'test') app.use(morgan('dev'));
app.use(cors());
app.disable('x-powered-by');

// setup body parser so we can access req.body in controllers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

// parse query parameters from JSON
app.use(function(req, res, next) {
	if (req.query && req.query.query) {
		try {
			req.query = JSON.parse(req.query.query);
			return next();
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	} else {
		return next();
	}
});

// include controllers
const router = express.Router();
app.use('/v1', router);
fs.readdirSync('./controllers').forEach((file) => {
	if(file.substr(-3) == '.js') {
		const controller = require('./controllers/' + file);
		controller(app, mongoose, router);
	}
});

// start Express
const server = app.listen(config.server.port, () => {
	if (config.environment != 'test') console.log('Web server running on port %s.', config.server.port);
});

module.exports = {
	config: config,
	mongoose: mongoose
};

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *                 ApplicationServer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *             (Do not change this code)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Require Modules to setup the REST Api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * - `express` Express.js is a Web Framework
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * - `morgan` Isn't required but help with debugging and logging
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * - `body-parser` This module allows to parse the body of the post request into a JSON
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


/**
 * Require the Blockchain class. This allow us to have only one instance of the class.
 */


var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _blockchain = require('./model/blockchain');

var _blockchain2 = _interopRequireDefault(_blockchain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplicationServer = function () {
	function ApplicationServer() {
		_classCallCheck(this, ApplicationServer);

		//Express application object
		this.app = (0, _express2.default)();
		//Blockchain class object
		this.blockchain = new _blockchain2.default.Blockchain();
		//Method that initialized the express framework.
		this.initExpress();
		//Method that initialized middleware modules
		this.initExpressMiddleWare();
		//Method that initialized the controllers where you defined the endpoints
		this.initControllers();
		//Method that run the express application.
		this.start();
	}

	_createClass(ApplicationServer, [{
		key: 'initExpress',
		value: function initExpress() {
			this.app.set("port", 8000);
		}
	}, {
		key: 'initExpressMiddleWare',
		value: function initExpressMiddleWare() {
			this.app.use((0, _morgan2.default)("dev"));
			this.app.use(_bodyParser2.default.urlencoded({ extended: true }));
			this.app.use(_bodyParser2.default.json());
		}
	}, {
		key: 'initControllers',
		value: function initControllers() {
			require("./BlockchainController.js")(this.app, this.blockchain);
		}
	}, {
		key: 'start',
		value: function start() {
			var self = this;
			this.app.listen(this.app.get("port"), function () {
				console.log('Server Listening for port: ' + self.app.get("port"));
			});
		}
	}]);

	return ApplicationServer;
}();

new ApplicationServer();
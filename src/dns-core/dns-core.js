var retry = require('retry');
var dns = require('dns');

module.exports = (function () {
	'use strict';

	function DNSCore (config) {
		config = config || {};

		this.retries = config.retries;
		this.maxTimeout = config.maxTimeout; 
		this.minTimeout = config.minTimeout; 
		this.factor = Math.pow(this.maxTimeout, 1 / this.retries);
	}

	DNSCore.prototype.resolve = function (hostname, callback) {
		var operation = retry.operation({
			retries: this.retries,
			factor: this.factor,
			minTimeout: this.minTimeout,
			maxTimeout: this.maxTimeout,
			randomize: false
		});

		operation.attempt(function (attemptCount) {
			dns.resolve(hostname, function (e, addresses) {
				if (operation.retry(e)) {
					return null;
				}

				if (e) {
					return callback(operation.mainError());
				}

				callback(null, addresses);
			});
		});
	};

	return DNSCore;
})();

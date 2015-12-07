var redis = require('redis');
var first = require('ee-first');

module.exports = (function () {
	'use strict';

	function DNSCache (config, callback) {
		config = config || {};

		this.expiration = config.expiration;

		this.redis = redis.createClient(
			config.port,
			config.host,
			{
				parser: 'hiredis'
			}
		);

		first([
			[this.redis, 'error', 'ready', 'connect']
		], callback);
	}

	DNSCache.prototype.get = function (hostname, callback) {
		this.redis.get(hostname, function (e, jsonAddresses) {
			if (e) {
				return callback(e);
			}

			var objAddresses = null;

			try {
				objAddresses = JSON.parse(jsonAddresses);
			}
			catch (e) {
				return callback(e);
			}

			callback(null, objAddresses);
		});
	};

	DNSCache.prototype.set = function (hostname, objAddresses, callback) {
		var jsonAddresses = null;

		try {
			jsonAddresses = JSON.stringify(objAddresses);
		}
		catch (e) {
			return callback(e);
		}

		this.redis.set(hostname, jsonAddresses, 'PX', this.expiration, function (e) {
			if (e) {
				return callback(e);
			}

			callback(null, objAddresses);
		});
	};

	return DNSCache;
})();

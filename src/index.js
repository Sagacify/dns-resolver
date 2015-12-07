var IDNSCache = require('./dns-cache/i-dns-cache');
var IDNSCore = require('./dns-core/i-dns-core');
var net = require('net');

module.exports = (function () {
	'use strict';

	function URLResolver (config, callback) {
		config = config || {};

		this.dnsCore = new IDNSCore(config.core);
		this.dnsCache = new IDNSCache(config.cache, callback);
	}

	URLResolver.prototype.resolve = function (hostname, options, callback) {
		async.waterfall([
			function (cb) {
				this.dnsCache.get(hostname, cb);
			}.bind(this),
			function (addresses, cb) {
				if (addresses) {
					return cb(null, addresses, true);
				}

				this.dnsCore.resolve(
					hostname,
					options,
					function (e, addresses) {
						cb(e, addresses, false);
					}
				);
			}.bind(this),
			function (addresses, cached, cb) {
				if (cached === true) {
					return cb(null, addresses);
				}
				else if (!addresses) {
					return cb(null, null);
				}

				this.dnsCache.set(hostname, addresses, cb);
			}.bind(this),
		], function (e, addresses) {
			if (e) {
				return callback(e);
			}

			if (!Array.isArray(addresses) || !addresses.length) {
				return callback(
					new Error('IDNSResolver: Hostname `' + hostname + '` couldn\'t be resolved to any IP address')
				);
			}

			var randomAddress = this.addressRandomizer(addresses);
			var family = net.isIPv4(randomAddress) ? 4 : 6;

			callback(null, addresses);
		}.bind(this));
	};

	URLResolver.prototype.resolveAll = function (hostname, options, callback) {
		this.resolve(hostname, options, function (e, addresses) {
			if (e) {
				return callback(e);
			}

			callback(
				null,
				addresses.map(function (address) {
					return {
						ip: address,
						family: net.isIPv4(address) ? 4 : 6
					};
				})
			);
		});
	};

	URLResolver.prototype.resolveRandom = function (hostname, options, callback) {
		this.resolve(hostname, options, function (e, addresses) {
			if (e) {
				return callback(e);
			}

			var address = _.sample(addresses);

			callback(
				null,
				{
					ip: address,
					family: net.isIPv4(address) ? 4 : 6
				}
			);
		});
	};

	return URLResolver;
})();

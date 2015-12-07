var DNSCache = require('./dns-cache');

module.exports = (function () {
	'use strict';

	function IDNSCache (config) {
		config = config || {};
 
		this.dnsCache = new DNSCache(config);
	}

	IDNSCache.prototype.resolve = function (hostname, callback) {
		if (typeof hostname !== 'string' || !hostname.length) {
			return callback(
				new Error('IDNSCache::resolve() - Type of `' + hostname + '` is not `String`')
			);
		}

		if (typeof callback !== 'function') {
			return callback(
				new Error('IDNSCache::resolve() - Type of `' + callback + '` is not `Function`')
			);
		}

		return this.dnsCache.resolve(hostname, callback);
	};

	return IDNSCache;
})();

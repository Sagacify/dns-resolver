var DNSCache = require('./dns-cache');

module.exports = (function () {
	'use strict';

	function IDNSCache (config, callback) {
		config = config || {};
 
		this.dnsCache = new DNSCache(config, callback);
	}

	IDNSCache.prototype.get = function (hostname, callback) {
		if (typeof hostname !== 'string' || !hostname.length) {
			return callback(
				new Error('IDNSCache::get() - Type of `hostname` with value `' + hostname + '` is not `String`')
			);
		}

		if (typeof callback !== 'function') {
			return callback(
				new Error('IDNSCache::get() - Type of `callback` with value `' + callback + '` is not `Function`')
			);
		}

		return this.dnsCache.get(hostname, callback);
	};

	IDNSCache.prototype.set = function (hostname, objAddresses, callback) {
		if (typeof hostname !== 'string' || !hostname.length) {
			return callback(
				new Error('IDNSCache::set() - Type of `hostname` with value `' + hostname + '` is not `String`')
			);
		}

		if (Array.isArray(objAddresses) === false) {
			return callback(
				new Error('IDNSCache::set() - Type of `objAddresses` with value `' + objAddresses + '` is not `Array`')
			);
		}

		if (typeof callback !== 'function') {
			return callback(
				new Error('IDNSCache::set() - Type of `callback` with value `' + callback + '` is not `Function`')
			);
		}

		return this.dnsCache.set(hostname, objAddresses, callback);
	};

	return IDNSCache;
})();

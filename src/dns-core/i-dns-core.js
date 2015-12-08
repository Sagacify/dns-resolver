var DNSCore = require('./dns-core');

module.exports = (function () {
	'use strict';

	function IDNSCore (config) {
		config = config || {};
 
		this.dnsResolver = new DNSCore(config);
	}

	IDNSCore.prototype.resolve = function (hostname, options, callback) {
		options = options || {};

		if (typeof hostname !== 'string' || !hostname.length) {
			return callback(
				new Error('IDNSCore::resolve() - Type of `hostname` with value `' + hostname + '` is not `String`')
			);
		}

		if (typeof options !== 'object') {
			return callback(
				new Error('IDNSCore::resolve() - Type of `options` with value `' + options + '` is not `Object`')
			);
		}

		if (typeof callback !== 'function') {
			return callback(
				new Error('IDNSCore::resolve() - Type of `callback` with value `' + callback + '` is not `Function`')
			);
		}

		return this.dnsResolver.resolve(hostname, callback);
	};

	return IDNSCore;
})();

var request = require('request'),
	Q = require('q');

module.exports = request;

module.exports.request_p = function(optionsOrUrl) {
	var defer = Q.defer();
	request(optionsOrUrl, function(error, response, body) {
		if (error) {
			defer.reject(error);
		} else {
			defer.resolve(response);
		}
	});
	return defer.promise;
};

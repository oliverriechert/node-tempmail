var request = require('request')
	, when = require('when');

module.exports = request;

module.exports.request_p = function(optionsOrUrl) {
	var defer = when.defer();
	request(optionsOrUrl, function(error, response, body) {
		return error ? defer.reject(error) : defer.resolve(response);
	});
	return defer.promise;
};

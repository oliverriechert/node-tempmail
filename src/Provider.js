
var Provider = function(website) {
	switch (website) {
		case '10minutemail.net':
			this.handler = require('./providers/TenMinuteMailNet');
			break;
		default:
			throw new Error('Unsupported website: ' + website);
	}
};

Provider.prototype.newTempEmail = function() {
	return this.handler.newTempEmail();
};

Provider.prototype.readEmailAddress = function(emailAddress) {
	return this.handler.readEmailAddress(emailAddress);
};

module.exports = Provider;

#!/usr/bin/env node

var Provider = require('./src/Provider');

module.exports = Provider;

// CLI
var exit = function(error, out) {
	if (error) {
		console.error(error.stack || error); process.exit(1);
	} else if (out) {
		if (typeof out === 'object') {
			try { var json = JSON.stringify(out); } catch(e) {}
		}
		process.stdout.write(json || out);
	}
	process.exit(0);
};

var main = function() {
	var provider = process.argv[2];
	var emailAddress = process.argv[3];

    if (!provider) {
    	exit([
    	'Usage: ./tempmail <provider> [emailAddress]', '',
    	'- By specifying only a provider, it will return a new email address.',
    	'- Specifying an email will return the inbox (JSON).'
    	].join('\n'));
	}

	var provider = new Provider(provider);

	if (!emailAddress) {
		// create a new email
		provider.newTempEmail(provider).then(function(tempEmail) {
			exit(null, tempEmail.getAddress());
		}).done();
	} else {
		// fetch the inbox
		provider.readEmailAddress(emailAddress).then(function(inbox) {
			exit(null, inbox);
		}).done();
	}
}

if (require.main === module) {
	try { main(); } catch(e) { exit(e); }
}

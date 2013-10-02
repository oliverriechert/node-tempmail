#!/usr/bin/env node

var Provider = require('./src/Provider');

module.exports = Provider;

require('main')
.usage(['Usage: ./tempmail <provider> [emailAddress]', '',
	'- By specifying only a provider, it will return a new email address.',
	'- Specifying an email will return the inbox (JSON).'
].join('\n'))
.run(function(argv, exit, help) {
	var providerName = argv._[0];
	var emailAddress = argv._[1];
	if (!providerName) { exit(1, help); }

	var provider = new Provider(providerName);

	if (!emailAddress) {
		// create a new email
		provider.newTempEmail(provider).then(function(tempEmail) {
			exit(null, tempEmail.getAddress());
		}).otherwise(function(error) {
			exit(1, error);
		});
	} else {
		// fetch the inbox
		provider.readEmailAddress(emailAddress).then(function(inbox) {
			exit(null, inbox);
		}).otherwise(function(error) {
			exit(1, error);
		});
	}
});

# tempmail

Easily create temporary emails and fetch their inbox.

## Usage & Installation

    npm install tempmail

### From the command line

```bash
./tempmail <provider> [emailAddress]
```

- By specifying only a provider, it will create a new email address.
- Specifying an email will return the inbox (JSON).


### As a module:

```javascript
var tempmail = require('tempmail');

// using 10minutemail as our provider
var provider = new tempmail('10minutemail.net');

// Create a new temporary email
provider.newTempEmail(provider).then(function(tempEmail) {
	console.log(tempEmail);
	var emailAddress = tempEmail.getAddress();

	// Retrieve emails from an email address
	provider.readEmailAddress(emailAddress).then(function(inbox) {
		console.log(inbox); // an array of inbox message objects
	});
});
```

## Providers

 - [10minutemail.net](http://10minutemail.net/)
 - More to come...

Providers are services that provide temporary emails. See the example above on how to use a specific provider.

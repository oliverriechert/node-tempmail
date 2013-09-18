# tempmail

Easily create temporary emails and fetch their inbox.

## Warning

This is sitting at version 0.0.1 for a reason. I needed an excuse to work with promises and this was the result of a nights work. I'll slowly work on this more over the next few weeks making it a "proper" module with tests, documentation, etc. I didn't expect it to get this far.

## Usage

### As a script:

    ./tempmail <provider> [emailAddress]

- By specifying only a provider, it will return a new email address.
- Specifying an email will return the inbox (JSON).


### As a module (haven't tested, but theoretically):

    var tempmail = require('tempmail');
    var ttm = tempmail('10minutemail.net');
    ttm.newTempEmail().then(function(tempEmail) {
        console.log(tempEmail);
    }).done();

## Providers

Providers are services that provide temporary emails.

### External

As of now, there is support for [only one](http://10minutemail.net/) external provider. More external providers will come once the code as settled.

### Local

Support for local emails (e.g. creating temporary emails on your own server vs. relying on an external service) would be neat. This way we're not hitting someone else's server.

## Be Nice

Please don't make thousands of emails in a short period of time on external providers. It's a free service they're providing after all.

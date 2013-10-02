var TempEmail = require('../TempEmail')
	, request = require('../promise/request')
	, cheerio = require('cheerio')
	, when = require('when')
	, url = require('url');

exports.newTempEmail = function() {
	var reqOptions = {
		url: url.parse('http://10minutemail.net/en/'),
		jar: true // enable cookies for this request
	};
	return request.request_p(reqOptions).then(function(res) {
		var cookies = res.headers['set-cookie'];
		var $ = cheerio.load(res.body);
		var emailAddress = $('#fe_text').val();

		// TODO make TempEmail take a provider
		var tempEmail = new TempEmail('10minutemail.net', emailAddress, cookies);

		return tempEmail.persist().then(function() {
			return when.resolve(tempEmail);
		});
	});
};

var getEmailContent = function(reqOptions) {
	return request.request_p(reqOptions).then(function(res) {
		var $ = cheerio.load(res.body);

		var content = $('#tabs-1').html();
		var headerInfo = $('#message tr td').map(function(index, element) {
			return $(element).text();
		});

		return when.resolve({
			from: headerInfo[1],
			to: headerInfo[3],
			subject: headerInfo[5],
			date: headerInfo[7],
			content: content
		});
	});
};

exports.readTempEmail = function(tempEmail) {

	var jar = request.jar();
	tempEmail.getCookies().forEach(function(cookie) {
		jar.add(request.cookie(cookie));
	});

	var reqOptions = {
		url: url.parse('http://10minutemail.net/en/mailbox.ajax.php'),
		jar: jar
	};

	return request.request_p(reqOptions).then(function(res) {
		var $ = cheerio.load(res.body);
		var emailLinks = $('a').map(function(index, element) {
			return $(element).attr('href');
		});
		return when.all(emailLinks.map(function(link) {
			return getEmailContent({
				url: 'http://10minutemail.net/en/' + link,
				jar: jar
			});
		}));
	});
};

exports.readEmailAddress = function(emailAddress) {
	return TempEmail.load(emailAddress).then(function(tempEmail) {
		return exports.readTempEmail(tempEmail);
	});
};

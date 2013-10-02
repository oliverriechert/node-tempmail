var sqlite3 = require('./promise/sqlite3')
	, when = require('when')
	, sequence = require('when/sequence');

var TempEmail = function(website, address, cookies) {
	this.website = website;
	this.address = address;
	this.cookies = cookies;
};

TempEmail.prototype.getWebsite = function() { return this.website; }
TempEmail.prototype.getAddress = function() { return this.address; };
TempEmail.prototype.getCookies = function() { return this.cookies; };

TempEmail.prototype.persist = function() {
	var that = this;
	return sqlite3.newDatabase_p().then(function(db) {
		var createSql = [
			'create table if not exists email',
			'(',
				'address text primary key,',
				'website text,',
				'cookiesJson text',
			')'].join('\n');

		var insertSql= [
			'insert into email values (',
			 	'$address,',
			 	'$website,',
			 	'$cookiesJson',
			')'].join(' ');

		var insertParams = {
			$address: that.address,
			$website: that.website,
			$cookiesJson: JSON.stringify(that.cookies)
		};

		return sequence([
			function() { return sqlite3.run_p(db, createSql); },
			function() { return sqlite3.run_p(db, insertSql, insertParams); }
		]).ensure(function() { db.close(); });
	});
};

TempEmail.load = function(emailAddress) {
	return sqlite3.newDatabase_p()
	.then(function(db) {
		var selectSql = 'select * from email where address = $address';
		return sqlite3.all_p(db, selectSql, { $address: emailAddress})
		.then(function(rows) {
			return (rows.length === 0) ?
				when.reject(
					new Error('Email address does not exist in sqlite')) :
				when.resolve(new TempEmail(rows[0].website, rows[0].address,
					JSON.parse(rows[0].cookiesJson)));
		})
		.ensure(function() {
			db.close();
		});
	});
};

TempEmail.prototype.toString = function() {
	return JSON.stringify({
		website: this.website,
		address: this.address
	});
};

module.exports = TempEmail;

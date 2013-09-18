var sqlite3 = require('./promise/sqlite3'),
	Q = require('q');

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
			')'
		].join('\n');

		var insertSql = 'insert into email values (' +
		 	'$address,' +
		 	'$website,' +
		 	'$cookiesJson' +
		 ')';

		return sqlite3.run_p(db, createSql)
		.then(function() {
			return sqlite3.run_p(db, insertSql, {
				$address: that.address,
				$website: that.website,
				$cookiesJson: JSON.stringify(that.cookies)
			});
		})
		.fin(function() {
			db.close();
		});
	});
};

TempEmail.load = function(emailAddress) {
	return sqlite3.newDatabase_p()
	.then(function(db) {
		var selectSql = 'select * from email where address = $emailAddress';
		return sqlite3.all_p(db, selectSql, { $emailAddress: emailAddress})
		.then(function(rows) {
			if (rows.length === 0) {
				throw new Error('Email address does not exist in the database');
			}
			return Q.fcall(function() {
				return new TempEmail(
					rows[0].website, rows[0].address,
					JSON.parse(rows[0].cookiesJson));
			});
		})
		.fin(function() {
			db.close();
		});
	})
};

TempEmail.prototype.toString = function() {
	return JSON.stringify({
		website: this.website,
		address: this.address
	});
};

module.exports = TempEmail;

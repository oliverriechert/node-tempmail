var sqlite3 = require('sqlite3').verbose(),
	Q = require('q');

module.exports = sqlite3;

module.exports.run_p = function(db, sql, param) {
	var defer = Q.defer();
	param = param || {};
	db.run(sql, param, function(error) {
		if (error) { return defer.reject(error); } else { defer.resolve(); }
	});
	return defer.promise;
};

module.exports.all_p = function(db, sql, param) {
	var defer = Q.defer();
	param = param || {};
	db.all(sql, param, function(error, rows) {
		if (error) { return defer.reject(error); }
	    defer.resolve(rows);
	});
	return defer.promise;
};

module.exports.newDatabase_p = function() {
	var defer = Q.defer();
	var db = new sqlite3.Database(__dirname + '/tempmail.db');
	db.once('error', function(error) {
		if (error) { defer.reject(error); }
	});
	db.once('open', function() {
		defer.resolve(db);
	});
	return defer.promise;
};

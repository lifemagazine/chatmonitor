var crypto = require('crypto'), 
	scmp = require('scmp'),
	config = require('./config');

var passwordCreate = function passwordCreate(password, cb) {
	crypto.randomBytes(config.crypto.randomSize, function(err, salt) {
		if (err)
			return cb(err, null);
		crypto.pbkdf2(password, salt.toString('base64'), 
			config.crypto.workFactor, config.crypto.keylen,
				function(err, key) {
					cb(null, salt.toString('base64'), key.toString('base64'));
				});
	});
};

var passwordCheck = function passwordCheck(password, derivedPassword, salt, work, cb) {
	crypto.pbkdf2(password, salt, work, config.crypto.keylen, function(err, key) {
		cb(null, scmp(key.toString('base64'), derivedPassword));
	});
};

function test() {
	// passwordCreate('password', print);

	var derivedPassword = "laov003nrOVhYre+ZQHInx3flCwWfU0Qq8fXtoRPcG74rB9bevS01wd2/C5f06Tt6BGWGimlpA4hDRP7mQI2MF8WK7PAGKPQhICMwxiwfrFBNXFuAmBDDZjaIXOIqSkTeMNh8Yplo84DTBkgfqhvCrk8U/gNV4foBDftI19jA7fIIdpZR2SU53qb6dC9FeVHv1oM4pTwYWI9JwBbrgQM3PWnjj8K6LYHIBpLv68JEnLhZAHrJFeQD9WqnFrjT0U2QFTI+MjytAoTjLfcTOQ3pFu4mxC5IwvyARXLbvGV1sUrfNnVD/RG2ZN3sTNpW903jeIqDC94K4odcg7ul0Eq2Q==";
	var salt = "2v2Ov966zx3fvTM9hUzwtuNZqBecPbQlfNcXKUGMidyyBAPvVJKRQgbluwsLw5BV2hV923TOFGsmyfFDsABa0I18UVexbxpOfKWSTIfLKVF1WEkzyLWqtxRn2PzFMMfegCZyljWMPXDV4cikeVar60M8Yjkq9kqGNV8yOQUpB1Q6hN9WyU8lB/EwPXqTYenyySEfu7vztP03btWh+eCu3VkgV/oVeomTh6ndXzrLaNIprmpyB8v82/7cLOGlUvqRwFrzedjF79R7GdZxr7U1HPKipMThmApfVOCcB1hI3E/oeOZ462O4awym3ZNhFTV4jIHjeM4cXI9iABKPsU8TqA==";
	var work = 1;
	passwordCheck('password', derivedPassword, salt, work, print2);
}

function print(salt, password) {
	console.log(salt);
	console.log('---------------------');
	console.log(password);
	console.log('---------------------');
}

function print2(result) {
	console.log(result);
}

test();


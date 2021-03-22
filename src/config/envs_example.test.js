const assert = require('assert');
const envs = require('./envs_example')

describe('Load envs', function () {

	it('should have PROD', function () {
		assert.notStrictEqual(envs.PROD, null)  
	})
})
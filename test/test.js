var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
	postcss([ plugin(opts) ]).process(input).then(function (result) {
		expect(result.css).to.eql(output);
		expect(result.warnings()).to.be.empty;
		done();
	}).catch(function (error) {
		done(error);
	});
};

describe('postcss-px-to-em', function () {

	it('replaces pixel values', function(done) {
		test('a{width: 200px;}', 'a{width: 12.5em;}', {}, done);
	});

	it('ignores non-decl (like media queries)', function(done) {
		test('@media (max-width: 100px) {}', '@media (max-width: 100px) {}', {}, done);
	});

	it('ignores explicit px values', function(done) {
		test('a{width: 200px /* force */;}', 'a{width: 200px /* force */;}', {}, done);
	});

	it('obeys custom base', function(done) {
		test('a{width: 200px;}', 'a{width: 20em;}', {base: 10}, done);
	});

	it('works with multiple tokens', function(done) {
		test('a{margin: 200px 400px;}', 'a{margin: 20em 40em;}', {base: 10}, done);
	});

	it('ingnores explicit px values within multiple tokens', function(done) {
		test('a{margin: 200px/*force*/ 400px 200px 100px;}', 'a{margin: 200px/*force*/ 40em 20em 10em;}', {base: 10}, done);
	});

});

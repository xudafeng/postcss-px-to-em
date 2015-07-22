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

describe('postcss-pixels-to-em', function () {

    it('replaces pixel values', function(done) {
        test('a{width: 200px;}', 'a{width: 12.5em;}', {}, done);
    });

    it('ignores non-decl (like media queries)', function(done) {
        test('@media (max-width: 100px) {}', '@media (max-width: 100px) {}', {}, done);
    });

    it('ignores explicit px values', function(done) {
        test('a{width: 200px /* force */;}', 'a{width: 200px /* force */;}', {}, done)
    });

    it('obeys custom base', function(done) {
        test('a{width: 200px;}', 'a{width: 20em;}', {base: 10}, done);
    });

});

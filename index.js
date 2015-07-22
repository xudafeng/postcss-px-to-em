var postcss = require('postcss');
var _ = require('lodash-node');

module.exports = postcss.plugin('postcss-pixels-to-em', function (opts) {
  var defaults = {
    base: 16,
  };

  opts = _.extend({}, defaults, opts);

  var regex = /((\d+).*?)(px)/g;

  var convert = function(context) {
    var contextMinified = context.replace(/\s/g, '');
    var replaceable = context.match(regex);

    if (replaceable && contextMinified.indexOf('/*force*/') === -1) {
      replaceable.forEach(function(value) {
        var matches = regex.exec(value);
        regex.lastIndex = 0;

        var relative = matches[1] / opts.base;

        context = context.replace(value, relative + 'em');
      });
    }

    return context;
  };

  return function (css) {
    css.eachInside(function(node) {
      if (node.type === 'decl') {
        node.value = convert(node._value ? node._value.raw : node.value);
      }
    });
  };
});


/**
 * Expose `Macros`.
 */

module.exports = Macros;

/**
 * Initialize `Macros`
 *
 * - `prefix` defaulting to ":"
 *
 * @param {Object} [opts]
 * @api public
 */

function Macros(opts) {
  opts = opts || {};
  this.prefix = opts.prefix || ':';
  this.plugins = [];
}

/**
 * Add a plugin `fn`.
 *
 * @param {Function} fn
 * @api public
 */

Macros.prototype.use = function(fn){
  this.plugins.push(fn);
};

/**
 * Convert `fn` to a string of javascript and
 * replace references to `$[0-9]` with the
 * arguments passed.
 *
 * @param {Function} fn
 * @param {Mixed} ...
 * @api public
 */

Macros.prototype.script = function(fn){
  var re = /^function *\( *\) *\{\s*|\s*\}$/g;
  var args = [].slice.call(arguments, 1);

  fn = fn.toString().replace(re, '');
  var str = fn.replace(/^ */gm, '');

  str = str.replace(/\$([0-9])/g, function(_, n){
    return JSON.stringify(args[n]);
  });

  return str;
};

/**
 * Apply plugin functions to `str`.
 *
 * @param {String} str
 * @return {STring}
 * @api private
 */

Macros.prototype.visit = function(str){
  var res = [];
  for (var i = 0; i < this.plugins.length; i++) {
    var ret = this.plugins[i].call(this, str);
    if (null == ret) continue;
    res.push(ret);
  }
  return res;
};

/**
 * Process `js` string with plugins.
 *
 * @param {String} js
 * @return {String}
 * @api public
 */

Macros.prototype.process = function(js){
  var re = /^( *\/\/.*)/gm;
  var prefix = this.prefix;
  var self = this;

  return js.split(re).map(function(str, i){
    // non-comment
    if (i % 2 == 0) return str;

    // strip
    var s = str.replace('//', '');
    var indent = s.replace(/^( *).*/, '$1');

    // check prefix
    if (0 != s.trim().indexOf(prefix)) return str;

    // normalize
    var stripped = s.replace(prefix, '').trim();

    // apply plugins
    return self.visit(stripped).map(function(s){
      return indent + s;
    }).join('\n');
  }).join('');
};
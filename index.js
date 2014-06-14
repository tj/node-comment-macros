
module.exports = Macros;

function Macros(opts) {
  opts = opts || {};
  this.prefix = opts.prefix || ':';
  this.plugins = [];
}

Macros.prototype.use = function(fn){
  this.plugins.push(fn);
};

Macros.prototype.visit = function(str){
  var res = [];
  for (var i = 0; i < this.plugins.length; i++) {
    var ret = this.plugins[i](str);
    if (null == ret) continue;
    res.push(ret);
  }
  return res;
};

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
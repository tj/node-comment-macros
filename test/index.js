
var Macros = require('..');
var fs = require('fs');

function fixture(path) {
  return fs.readFileSync(path, 'utf8');
}

describe('.use(fn)', function(){
  it('should register a function to transform macro comments', function(){
    var js = fixture('test/fixtures/simple.js');

    var m = new Macros;

    m.use(function(label){
      return 'console.log("' + label + '")';
    });

    m.use(function(label){
      if (0 == label.indexOf('start ')) {
        return 'console.time("' + label + '")';
      }

      if (0 == label.indexOf('end ')) {
        return 'console.timeEnd("' + label + '")';
      }
    });

    var s = m.process(js);
    s.should.equal(fixture('test/fixtures/simple.out.js'))
  })
})
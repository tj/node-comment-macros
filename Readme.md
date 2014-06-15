
# node-comment-macros

  Node / JavaScript comment macros useful for injecting logging, tracing, debugging, or stats related code.

  Stop writing code like this:

```js
var user = { name: 'tobi' };
console.log("start saving user")
console.time("start saving user")
db.save(user, function(err){
  console.log("end saving user")
  console.timeEnd("end saving user")
});
```

## About

  I wouldn't recommend this at the library level, normally even at the application level I wouldn't recommend it, but some of our projects require a _lot_ of logging and metrics, so this helps cut the clutter.

  Alternatively you could emit events, but then it's unclear if those events are just for logging or not. Also then you don't have full access to the scope which is also annoying and sometimes very verbose, otherwise I'd recommend just having a function or method call as the entry-point for these other tasks.

## Installation

```
$ npm install comment-macros
```

## Example

 You can specify a `prefix` which defaults to ":",
 telling comment-macros what is and what is not a macro.

```js
var user = { name: 'tobi' };
//: start saving user
db.save(user, function(err){
  // normal comment
  //: end saving user
});
```

 Then you can map them to new values. Note that if you
 return `null` / `undefined` that nothing will happen,
 so if you have no plugins these comments will simply
 be removed.

 Other than that you can do whatever you like, with
 full access to the variables in scope!

```js
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
console.log(s);
```

  Yielding:

```js
var user = { name: 'tobi' };
console.log("start saving user")
console.time("start saving user")
db.save(user, function(err){
  // normal comment
  console.log("end saving user")
  console.timeEnd("end saving user")
});
```

## Scripting

  A `this.script(fn)` method is also available to aid in scripting. Suppose for example you want to replace the following macro comment with multiple lines of javascript, it would be pretty annoying with strings:

```js
//: convert to csv
data.pipe(csv).pipe(process.stdout);
```

  So the helper may be used to generate a string of javascript. Arguments passed may be referenced with `$[0-9]` and are converted to JSON. Here's an example passing in the `label` string. It cannot be used via closure because the function passed to `this.script` is effectively a template, think of it as a string, not as a closure.

```js
m.use(function(label){
  return this.script(function(){
    console.log($0);
    console.timeStart($0)
    stats.incr($0)
  }, label);
});
```

  Yielding:

```js
console.log("convert to csv");
console.timeStart("convert to csv")
stats.incr("convert to csv")
data.pipe(csv).pipe(process.stdout);
```

# License

  MIT
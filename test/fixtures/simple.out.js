var user = { name: 'tobi' };
console.log("start saving user")
console.time("start saving user")
db.save(user, function(err){
  // normal comment
  console.log("end saving user")
  console.timeEnd("end saving user")
});
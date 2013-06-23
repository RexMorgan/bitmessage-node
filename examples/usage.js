var bitmessage = require('../lib/main')('localhost', 8442, 'user', 'password');

try {
  bitmessage.test.hello('Hi', 'Bob', function(value) {
    console.dir(value);
  });
}
catch(err) {
  console.dir(err);
}
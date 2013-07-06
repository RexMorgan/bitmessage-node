var bitmessage = require('../lib/main')('localhost', 8442, 'user', 'password');

try {
  bitmessage.messages.sent.list(function(value) {
    console.dir(value);
  });
}
catch(err) {
  console.dir(err);
}
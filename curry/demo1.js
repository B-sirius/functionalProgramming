var log = console.log;

var curry = require('lodash').curry;

var match = curry((what, str) => str.match(what));

var replace = curry((what, replacement, str) => str.replace(what, replacement));

var filter = curry(function(f, ary) {
    return ary.filter(f);
});

var map = curry((f, ary) => ary.map(f));

log(match(/\s+/g, 'john space'));
log(match(/\s+/g)('john space'));

var haveSpaces = match(/\s+/g);
// function(str) {
//     return str.match(/\s+/g);
// }

log(filter(haveSpaces, ['cowboy', 'space cowboy']));

var findSpaces = filter(haveSpaces);
// function(arr) {
//     return arr.filter((item) => item.match(haveSpaces));
// }

findSpaces(['john space']);





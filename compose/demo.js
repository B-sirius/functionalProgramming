var _ = require('lodash');

var log = (x) => {
    console.log(x);
}

// compose 初探
var compose = _.flowRight; // 从右向左执行

var reduce = _.curry((f, result, ary) => ary.reduce(f, result));

var reserve = reduce((result, item) => [item].concat(result), []);

var testArr = ['shit', 'holy shit', 'shiiiit'];

var first = ary => ary[0];

var last = compose(first, reserve); // 从右向左执行

log(last(testArr)); // shiiiit

var upper = string => string.toUpperCase();

var upperLast1 = compose(upper, compose(first, reserve));
var upperLast2 = compose(compose(upper, first), reserve);
var upperLast3 = compose(upper, first, reserve);

log(upperLast1(testArr)); //  SHIIIIT
log(upperLast2(testArr)); //  SHIIIIT
log(upperLast3(testArr)); //  SHIIIIT

// point free
var head = string => string[0];
var split = _.curry((reg, string) => string.split(reg));
var join = _.curry((what, ary) => ary.join(what));
var map = _.curry((f, ary) => ary.map(f));

var upperInitials = compose(join('.'), map(compose(upper, head)), split(' '));
log(upperInitials('Kujo Jotaro'));

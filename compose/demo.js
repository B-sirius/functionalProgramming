var _ = require('lodash');

var log = (x) => {
    console.log(x);
}

/* 
    compose初探
*/
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

/* 
    point free
*/
var head = string => string[0];
var split = _.curry((reg, string) => string.split(reg));
var join = _.curry((what, ary) => ary.join(what));
var map = _.curry((f, ary) => ary.map(f));

var upperInitials = compose(join('.'), map(compose(upper, head)), split(' '));
log(upperInitials('Kujo Jotaro'));

/* 
    简单的debug
*/
var trace = _.curry((tag, x) => {
    console.log(tag, x);
    return x;
});

var errorUpperInitials = compose(join('.'), compose(upper, head), split(' '));
// errorUpperInitials('Kujo Jotaro');  报错

traceErrorUpperInitials = compose(join('.'), compose(upper, head), trace('after split'), split(' '));
// traceErrorUpperInitials('Kujo Jotaro'); 输出 Array(2) ["Kujo", "Jotaro"] 后报错

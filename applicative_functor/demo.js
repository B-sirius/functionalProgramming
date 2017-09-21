var _ = require('ramda');
require('../support_ex');
var Task = require('data.task')

var log = x => {
    console.log(x);
}

Identity.prototype.ap = function(otherContainer) {
    return otherContainer.map(this.__value); // 注意这里的this.__value是一个函数
}

var add = _.curry((a, b) => a + b);
log(Identity.of(2).map(add).ap(Identity.of(3)));

/* 
    看起来不是很实用，但是除了更方便地调用外，还模糊了functor的类型
*/
var liftA2 = _.curry((f, functor1, functor2) => {
    return functor1.map(f).ap(functor2);
});


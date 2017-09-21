require('../support_ex');
var Task = require('data.task');
var _ = require('ramda');
var log = x => {
    console.log(x);
}

// 模拟浏览器的 localStorage 对象
var localStorage = {};

// 练习 1
// ==========
// 写一个函数，使用 Maybe 和 ap() 实现让两个可能是 null 的数值相加。

//  ex1 :: Number -> Number -> Maybe Number
var add = _.curry((x, y) => x + y);

var ex1 = function (x, y) {
    return Maybe.of(add).ap(Maybe.of(x)).ap(Maybe.of(y));
};
log(ex1(7, 13)); // => Maybe {__value: 20}

// 练习 2
// ==========
// 写一个函数，接收两个 Maybe 为参数，让它们相加。使用 liftA2 代替 ap()。

//  ex2 :: Maybe Number -> Maybe Number -> Maybe Number
var ex2 = liftA2(add);

log(ex2(Maybe.of(1), Maybe.of(2))); // => Maybe {__value: 3}

// 练习 3
// ==========
// 运行 getPost(n) 和 getComments(n)，两者都运行完毕后执行渲染页面的操作。（参数 n 可以是任意值）。

var makeComments = _.reduce(function (acc, c) {
    return acc + "<li>" + c + "</li>"
}, "");
var render = _.curry(function (p, cs) {
    return "<div>" + p.title + "</div>" + makeComments(cs);
});

//  ex3 :: Task Error HTML
var ex3 = Task.of(render).ap(getPost(1)).ap(getComments(2));

// 练习 4
// ==========
// 写一个 IO，从缓存中读取 player1 和 player2，然后开始游戏。

localStorage.player1 = "toby";
localStorage.player2 = "sally";

var getCache = function (x) {
    return new IO(function () {
        return localStorage[x];
    });
}
var game = _.curry(function (p1, p2) {
    return p1 + ' vs ' + p2;
});

//  ex4 :: IO String
var ex4 = IO.of(game).ap(getCache('player1')).ap(getCache('player2'));
log(ex4.unsafePerformIO()); // => toby vs sally

// 帮助函数
// =====================

function getPost(i) {
    return new Task(function (rej, res) {
        setTimeout(function () {
            res({
                id: i,
                title: 'Love them futures'
            });
        }, 300);
    });
}

function getComments(i) {
    return new Task(function (rej, res) {
        setTimeout(function () {
            res(["This book should be illegal", "Monads are like space burritos"]);
        }, 300);
    });
}
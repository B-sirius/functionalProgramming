var _ = require('ramda');

var log = x => {
    console.log(x);
}
var Maybe = function(x) {
    this.__value = x;
}

Maybe.of = function(x) {
    return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
    return (this.__value === null || this.__value === undefined);
}

Maybe.prototype.map = function(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}

log(Maybe.of({name: 'dimo'}).map(_.prop('sex')).map(_.prop('sex'))); // Maybe {__value: null}

// map :: Functor f => (a -> b) -> f a -> f b
var map = _.curry((f, functor) => functor.map(f));

// safeHead :: [a] => Maybe(a)
var safeHead = (xs) => Maybe.of(xs[0]);

var streetName = _.compose(map(_.prop('street')), safeHead, _.prop('address'));

log(streetName({address: []})); // Maybe {__value: null}

log(streetName({
    address: [
        {
            street: '女贞路'
        },
        {
            street: '贝克街'
        }
    ]
})); // Maybe {__value: "女贞路"}

// maybe :: b -> (a -> b) -> Maybe a -> b
var maybe = _.curry((x, f, m) => {
    return m.isNothing() ? x : f(m.__value);
})

var Left = function(x) {
    this.__value = x;
}

Left.of = function(x) {
    return new Left(x);
}

Left.prototype.map = function(f) {
    return this;
}

var Right = function(x) {
    this.__value = x;
}

Right.of = function(x) {
    return new Right(x);
}

Right.prototype.map = function(f) {
    return Right.of(f(this.__value));
}

log(Left.of('i dont wanna').map((str) => str + ' die!')); // Left {__value: "i dont wanna"}

log(Right.of('i dont wanna').map((str) => str + ' die!')); // Right {__value: "i dont wanna die!"}

var moment = require('moment');

// getAge :: Date -> user -> Either(String, Number)
var getAge = _.curry((now, user) => {
    var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
    if(!birthdate.isValid())
        return Left.of('Birth date cannot be parsed');
    return Right.of(now.diff(birthdate, 'years'));
});

log(getAge(moment(), 'Do not ask a lady\'s age'));
log(getAge(moment(), {birthdate: '1996-12-11'}));

// IO functor，包裹不纯的函数
var IO = function(f) {
    this.__value = f;
}

IO.of = function(x) {
    return new IO(function() {
        return x;
    });
}

IO.prototype.map = function(f) {
    return new IO(_.compose(f, this.__value));
}

var io_addressList = new IO(function() {
    return [{
        name: 'space cowboy',
        address: 'space'
    }, {
        name: 'jojo',
        address: 'unknown'
    }];
});

// jojoAddress :: [a] -> (a -> boolen) -> [b] -> b -> String
var jojoAddress = _.compose(_.prop('address'), _.head, _.filter((item) => item.name === 'jojo'));

// map是一个不停压栈的过程
var io_jojoAddress = io_addressList.map(jojoAddress);

// 调用 __value 来运行！
log(io_jojoAddress.__value()); // unknown
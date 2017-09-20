var _ = require('ramda');
require('../support_ex');

var log = x => {
    console.log(x);
}

/* 
    令人恶心的层层嵌套，就是monad
*/
//  safeProp :: Key -> {Key: a} -> Maybe a
var safeProp = _.curry(function (x, obj) {
    return new Maybe(obj[x]);
});

//  safeHead :: [a] -> Maybe a
var safeHead = safeProp(0);

//  firstAddressStreet :: User -> Maybe (Maybe (Maybe Street) )
var firstAddressStreet = _.compose(
    map(map(safeProp('street'))),
    map(safeHead),
    safeProp('addresses')
);

log(firstAddressStreet({
    addresses: [{
        street: {
            name: 'Mulburry',
            number: 8402
        },
        postcode: "WC2N"
    }]
}));
// Maybe(Maybe(Maybe({name: 'Mulburry', number: 8402})))

/* 
    救世主join
*/
var join = mma => mma.join();

// 一个join实现
// Maybe.prototype.join = function() {
//     return this.isnothing() ? Maybe.of(null) : this.__value;
// }

var betterFirstAddressStreet = _.compose(
    join, map(safeProp('street')), join, map(safeHead), safeProp('addresses')
);

log(betterFirstAddressStreet({
    addresses: [{
        street: {
            name: 'Mulburry',
            number: 8402
        },
        postcode: "WC2N"
    }]
}));
// Maybe({name: 'Mulburry', number: 8402})
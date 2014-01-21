var Emitter = require('./wildemitter');


function Fruit(name) {
    this.name = name;
    Emitter.call(this);
}

Fruit.prototype = new Emitter;

Fruit.prototype.test = function () {
    this.emit('test', this.name);
};

// set up some test fruits
var apple = new Fruit('apple'),
    orange = new Fruit('orange');

exports['Make sure wildcard handlers work'] = function (test) {
    var count = 0, 
        cb = function () {
            return function () {count++}
        };
    
    apple.on('*', cb());
    apple.on('te*', cb());
    // This should NOT add to count. Regression test for issue #4
    apple.on('other*', cb());
    apple.on('test', cb());
    apple.test();

    // sanity check to make sure we've got the emitter isolated to the instance
    orange.test();

    test.equal(count, 3);

    apple.off('test');

    // reset our counter
    count = 0;
    apple.test();

    test.equal(count, 2);
    test.done();
};

exports['Test group binding and unbinding'] = function (test) {
    var count = 0, 
        cb = function () {
            return function () {count++}
        };

    // test our groups
    orange.on('test', 'lumped', cb());
    orange.on('test', 'lumped', cb());
    orange.on('test', 'lumped', cb());
    orange.on('test', cb());
    orange.test();
    test.equal(count, 4);

    count = 0;
    orange.releaseGroup('lumped');
    orange.test();

    test.equal(count, 1);
    test.done();
};

exports['Test once for multiple functions'] = function (test) {
    var count, cb1, cb2;

    count = 0;
    cb1 = function () {
        count++;
    };
    cb2 = function () {
        count++;
    };

    orange.once('test', cb1);
    orange.once('test', cb2);
    orange.test();

    test.equal(count, 2);

    orange.test();
    test.equal(count, 2);

    test.done();
};

exports['Test on and off'] = function (test) {
    var count, cb1, cb2;

    count = 0;
    cb1 = function () {
        count++;
    };
    cb2 = function () {
        count++;
    };

    orange.on('test', cb1);
    orange.on('test2', cb2);
    orange.test();

    test.equal(count, 1);

    orange.off('test', cb1);
    orange.test();
    test.equal(count, 1);

    orange.emit('test2');
    test.equal(count, 2);

    test.done();
};


var repl = require('repl'),
    Emitter = require('./wildemitter');


function Fruit(name) {
    this.name = name;
    Emitter.call(this);
}

Fruit.prototype = new Emitter;

Fruit.prototype.test = function () {
    this.emit('test', this.name);
};

// set up some test fruits
var fruit1 = new Fruit('apple'),
    fruit2 = new Fruit('orange');

fruit1.on('*', function () {
    console.log('"*" handler called', arguments);
});

fruit1.on('te*', function () {
    console.log('"te*" handler called', arguments);
});

fruit1.on('test', function () {
    console.log('"test" handler called', arguments);
});

fruit1.test();
// just making sure we've got the emitter isolated to the instance
fruit2.test();


fruit1.off('test');

console.log('should be 3 logs');


fruit1.test();
console.log('should be 2 logs now');
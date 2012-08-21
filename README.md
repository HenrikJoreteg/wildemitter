#WildEmitter

##What is it?
A super lightweight EventEmitter similar to what comes in Node.js, but with a few specific differences:

- works in the browser (using some type of CommonJS module adapter, like stitch or browserify)
- support wildcard handlers: `emitter.on('*', doSomething)` or `emitter.on('myNamespace*', doSomething)`

This is largely based on the emitter in @visionmedia's UIKit. So, much props there. I just wanted it as a standalone on npm and with support for `*` handlers.

##How do I use it?

You can use it to add event capabilities to other objects you build like so:

```js
var Emitter = require('./wildemitter');

// the example object we're making
function Fruit(name) {
    this.name = name;
    
    // call emitter with this context
    Emitter.call(this);
}

// inherit from Emitter
Fruit.prototype = new Emitter;

// a function that emits an events when called
Fruit.prototype.test = function () {
    this.emit('test', this.name);
};

// set up some test fruits
var apple = new Fruit('apple');

apple.on('*', function () {
    console.log('"*" handler called', arguments);
});

apple.on('te*', function () {
    console.log('"te*" handler called', arguments);
});

apple.on('test', function () {
    console.log('"test" handler called', arguments);
});

// calling the method that emits events.
apple.test();

// it should write the following the log:
/*
"test" handler called { '0': 'apple' }
"*" handler called { '0': 'test', '1': 'apple' }
"te*" handler called { '0': 'test', '1': 'apple' }
*/

// this will remove any handlers explicitly listening for 'test' events.
apple.off('test');

// calling our method again would this time only call the two wildcard handlers
// producing the following output
/*
"*" handler called { '0': 'test', '1': 'apple' }
"te*" handler called { '0': 'test', '1': 'apple' }
*/

##License
MIT

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.
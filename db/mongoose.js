var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://shachopin:davidnight@ds151941.mlab.com:51941/todo-api-udemy');

module.exports = {mongoose};

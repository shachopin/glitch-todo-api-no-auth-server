const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


const port = process.env.PORT;
var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.use(function(req, res, next) { //allow cross domain middleware
  //res.setHeader('Access-Control-Allow-Origin', 'the value has to your client domain you access the api from - or just * to allow all');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", ["PATCH", "DELETE"]); 
  next();
});

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  
  console.log("after var todo = new Todo(), todo is ", todo)
  /*
  after var todo = new Todo(), todo is  { text: 'test text1',

  _id: 5b331105a9956203656e19bc,

  completedAt: null,

  completed: false }
  */
  console.log(todo.id)  //5b331105a9956203656e19bc

  todo.save().then((doc) => {
    console.log(doc === todo) //true  meaning exact same object
    console.log(doc)
    console.log(todo)
    /*
    above two lines both show
    { __v: 0,

    text: 'test text4',

    _id: 5b331290db56bc0a5b7295a5,

    completedAt: null,

    completed: false }
    */
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});



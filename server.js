var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 

//var mongoose = require('mongoose');
//mongoose.connect('/Users/ryanmckinnon/db');
/*mongoose.connect('mongodb://localhost/Users/ryanmckinnon/db');

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
}); */

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var courseArray =
 [{ name: "Java 101", category: "PROG", dateCreated: "1/1/2015", description: "Wow" },
  { name: "MongoDB 101", category: "DB", dateCreated: "2/1/2015", description: "Good" },
  { name: "Express 101", category: "PROG", dateCreated: "3/1/2015", description: "Better" },
  { name: "AngularJS 101", category: "WEB", dateCreated: "4/1/2015", description: "Best" },
  { name: "NodeJS 101", category: "PROG", dateCreated: "5/1/2015", description: "Awesome" }
];

// node.js API endpoints

// return all courses
app.get('/api/course', function(req, res) {
	res.json(courseArray);
});

// return course at given index
app.get('/api/course/:index', function(req, res) {
	res.json(courseArray[req.params.index]);
});

// add new course to list of courses
app.post('/api/course', function (req, res) {
	var newCourse = req.body;
	courseArray.push(newCourse);
	res.json(courseArray);
});

// delete course at given index
app.delete('/api/course/:index', function(req, res) {
	courseArray.splice(req.params.index, 1);
	res.json(courseArray)
});

// update course at given index
app.put('/api/course/:index', function (req, res) {
	var editedCourse = req.body;
	courseArray[req.params.index] = editedCourse;
	res.json(courseArray);
});

// Allow user to access profile.html and other static resources
app.use(express.static(__dirname + '/public'));

// define IP and port to listen on 
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use(session({ secret: "this is the secret"}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Allow user to access profile.html and other static resources
app.use(express.static(__dirname + '/public'));

passport.use(new LocalStrategy(
function(username, password, done)
{
	console.log("in passport");
	UserModel.findOne({username: username, password: password}, function (err, user){
		if(user)
		{
			console.log("in passport");
			// if user is found return user
						console.log(user);

			return done(null, user);
		}
		// otherwise we return FALSEEE
		return done(null, false, {message: 'Unable to login'});
	});
}));

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(user, done){
	done(null, user);
});



/*
 * DATABASE CONNECTION / SCHEMA
 */
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/db';
var db = mongoose.connect(connectionString); 


var WebSiteSchema = new mongoose.Schema({
	name: String,
	created: {type: Date, default: Date.now}
}, {collection: 'website'});

var WebSiteModel = mongoose.model('WebSite', WebSiteSchema);

// adds a new website to the database (shows user response doc)
app.get('/api/website/create/:name', function (req, res) {
	var website = new WebSiteModel({name: req.params.name });
	website.save(function (err, doc) {
		res.json(doc);
	});
});

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	roles: [String]
});

var UserModel = mongoose.model("UserModel", UserSchema);


//var admin = new UserModel({username: "alice", password: "alice", firstName: "Alice", lastName: "Wonderlane", roles:["admin"]});
//var student = new UserModel({username: "bobmarley", password: "marley", firstName: "Bob", lastName: "Marley", roles:["student"]});

//admin.save();
//student.save();

/*
 * API DEFINITIONS
 */

// retrieve websites by ID
app.get('/api/website/:id', function (req, res) {
	WebSiteModel.findById(req.params.id, function (err, sites) {
		res.json(sites);
	});
});

// retrieve all websites, show them all to user
app.get('/api/website', function (req, res) {
	WebSiteModel.find(function (err, sites) {
		res.json(sites);
	});

});

app.post("/login", passport.authenticate('local'), function(req, res){
	res.json(req.user);
});

app.get("/loggedin", function(req, res){
	res.send(req.isAuthenticated() ? req.user : '0');
});

app.post("/logout", function(req, res){
	req.logOut();
	res.send(200);
});



app.post("/register", function (req, res){
	UserModel.findOne({username: req.body.username}, function(err, user){
		if(user)
		{
			res.json(null);
			return;
		}
		else
		{
			var newUser = new UserModel(req.body);
			newUser.save(function(err, user){
				req.login(user, function(err)
				{
					if(err) {return next(err); }
					res.json(user);
				});
				
			});
		}
	});
	var newUser = req.body;
	console.log(newUser);
});

app.get('/process', function(req, res) {
	res.json(process.env);

});

// define IP and port to listen on 
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);


/*
var courseArray =
 [{ name: "Java 101", category: "PROG", dateCreated: "1/1/2015", description: "Wow" },
  { name: "MongoDB 101", category: "DB", dateCreated: "2/1/2015", description: "Good" },
  { name: "Express 101", category: "PROG", dateCreated: "3/1/2015", description: "Better" },
  { name: "AngularJS 101", category: "WEB", dateCreated: "4/1/2015", description: "Best" },
  { name: "NodeJS 101", category: "PROG", dateCreated: "5/1/2015", description: "Awesome" }
];
// Old API endpoints to serve as example
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
*/

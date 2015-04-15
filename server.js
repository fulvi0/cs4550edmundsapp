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
			console.log(user);

			// if user is found return user
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
	// list of edmunds vehicle IDs the user has favorited
	favoritedCars: [Number]
});

var CarSchema = new mongoose.Schema({
	vehicleId: Number,
	userFavorites: [String]
});

// model for keeping track of user data
var UserModel = mongoose.model("UserModel", UserSchema);

// model for keeping track of favorited car data
var CarModel = mongoose.model("CarModel", CarSchema);



//var admin = new UserModel({username: "alice", password: "alice", firstName: "Alice", lastName: "Wonderlane", roles:["admin"]});
//var student = new UserModel({username: "bobmarley", password: "marley", firstName: "Bob", lastName: "Marley", roles:["student"]});

//admin.save();
//student.save();

////var testCar = new CarModel({vehicleId: 200704634, userFavorites: []})
//testCar.save();
/*
 * API DEFINITIONS
 */

// login / logout functionality
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
		// if user already exists, return null
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

// retrieve user content for a given Edmunds vehicle ID
app.get("/getCarContent/:vehicleId", function (req, res){
	CarModel.findOne({vehicleId : req.params.vehicleId}, function(err, car){
		res.json(car);
	});
});

// favorite a car, add car ID to user entry and username to car entry
app.post("/favoriteCar/:username/:vehicleId", function(req, res){
	// add edmunds car ID to user entry
	UserModel.findOne({username : req.params.username}, function (err, user){
		// only let user favorite car if they haven't favorited it already
		if (user.favoritedCars.indexOf(req.params.vehicleId) == -1){
			user.favoritedCars.push(req.params.vehicleId);
			user.save();

			//res.json(user);
		}
	});

	// add username to car entry
	CarModel.findOne({vehicleId : req.params.vehicleId}, function(err, car){
		// check whether this car has been added yet
		if (car){
			// only save user in car entry if they have not favorited before
			if (car.userFavorites.indexOf(req.params.username) == -1)
			{
				car.userFavorites.push(req.params.username);
				car.save();
			}
		} else {
			var newCar = new CarModel({vehicleId: req.params.vehicleId, userFavorites: [req.params.username]});
			newCar.save();
		}
	});

	//console.log("sending current user from favorites");
	//console.log(currentUser);
	res.send(200);
});

// get processes running
app.get('/process', function(req, res) {
	res.json(process.env);
});

// define IP and port to listen on 
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ip);




// API calls from class, just for reference....
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

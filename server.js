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

// information for a user
var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
});

// car info for database so we avoid making API calls for just the vehicle name
var CarSchema = new mongoose.Schema({
	edmundsID: Number,
	vehicleName: String,
	modelYear: Number
});

var UserToCarFavoritesSchema = new mongoose.Schema({
	favoritedUsername: String,
	edmundsID: Number
});

// Vehicle Domain Object

// model for maintaining user data
var UserModel = mongoose.model("UserModel", UserSchema);

// model for maintainng car data
var CarModel = mongoose.model("CarModel", CarSchema);

var UserToCarFavoritesModel = mongoose.model("UserToCarFavoritesModel", UserToCarFavoritesSchema);


//var admin = new UserModel({username: "alice", password: "alice", firstName: "Alice", lastName: "Wonderlane", roles:["admin"]});
//var student = new UserModel({username: "bobmarley", password: "marley", firstName: "Bob", lastName: "Marley", roles:["student"]});

//admin.save();
//student.save();
//var newUserToCarFavorite = new UserToCarFavoritesModel({username: , edmundsID: });
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
	var newUserToCarFavorite = new UserToCarFavoritesModel({favoritedUsername: req.params.username, edmundsID: req.params.vehicleId});
	newUserToCarFavorite.save();

	// if we don't have this car in our local database yet, add it
	CarModel.findOne({edmundsID : req.params.vehicleId}, function(err, car){
		if (!car)
		{
			var newCar = new CarModel({edmundsID: req.params.vehicleId, vehicleName: 'bla', modelYear: 1992});
			newCar.save();
		}
	});

	res.send(200);
});

// unfavorite a car, remove relationship between user and vehicle
app.post("/deleteFavoriteCar/:username/:vehicleId", function(req, res){
	console.log("trying to remove edmundsID " + req.params.vehicleId + " attached to user " + req.params.username);
	UserToCarFavoritesModel.remove( {$and: [{favoritedUsername: req.params.username}, {edmundsID: req.params.vehicleId}]}, function(err,removed)
		{
			console.log("within remove error: " + err);
			console.log("within remove removed: " + removed);
		});
	res.send(200);
});

// retrieve the cars objects that a user likes
app.get("/getUsersFavorites/:username", function(req, res){
	var result;

	// find the relational entries
	UserToCarFavoritesModel.find({favoritedUsername: req.params.username}, function(err, relations)
	{
		console.log("Got array of cars user likes");

		// get a list of IDs of all cars the user likes from the relations, and find all entries in car model that match the IDs
		CarModel.find({edmundsID: {$in: relations.map(function(item){ return item.edmundsID})}}, function(err, cars){
			console.log(err);
			console.log("cars found are ");
			console.log(cars);

			// return all matches
			res.json(cars);
		});
	});
});

app.get("/getUsersFavoritesIDs/:username", function(req, res){
	var result;

	// find the relational entries
	UserToCarFavoritesModel.find({favoritedUsername: req.params.username}, function(err, relations)
	{
		console.log("Got array of cars user likes");

		// get a list of IDs of all cars the user likes from the relations, and find all entries in car model that match the IDs

		result = relations.map(function(item){return item.edmundsID});
		console.log("getUsersFavoritesIDs " + result);

		res.json(result);
	});
});

/*
	// information for a user
	var UserSchema = new mongoose.Schema({
		username: String,
		password: String,
		// one to many: cars this user has liked
		favoritedEdmundsIDs: [Number]
	});

	// car info for database so we avoid making API calls for just the vehicle name
	var CarSchema = new mongoose.Schema({
		edmundsID: Number,
		vehicleName: String,
		// one to many: users who have liked this vehicle
		favoritedUsers: [String]
	});


	var UserToCarFavoritesSchema = new mongoose.Schema({
	favoritedUsername: String,
	edmundsID: Number

});
*/

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

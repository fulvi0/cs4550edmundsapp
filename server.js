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

// information for a user
var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	location: String,
	about: String
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

// represent a user following another user
var UserToUserFollowSchema = new mongoose.Schema({
	followerUsername: String,
	followingUsername: String
});

// represent a user's comment on a car
var UserToCarCommentSchema = new mongoose.Schema({
	username: String,
	edmundsID: String,
	comment: String,
	date: { type: Date, default: Date.now }
});

// represent a user/s comment on a user's profile
var UserToUserCommentSchema = new mongoose.Schema({
	username: String,
	commenterUsername: String,
	comment: String,
	date: { type: Date, default: Date.now }
});

/*// schema for comments on car detail pages
var CarCommentSchema = new mongoose.Schema({
	edmundsID: Number,
	vehicleName: String,
	username: String,
	comment: String,
	date: { type: Date, default: Date.now }

});*/


// model for maintaining user data
var UserModel = mongoose.model("UserModel", UserSchema);

// model for maintainng car data
var CarModel = mongoose.model("CarModel", CarSchema);

var UserToCarFavoritesModel = mongoose.model("UserToCarFavoritesModel", UserToCarFavoritesSchema);

var UserToUserFollowModel = mongoose.model("UserToUserFollowModel", UserToUserFollowSchema);

var UserToCarCommentModel = mongoose.model("UserToCarCommentModel", UserToCarCommentSchema);

var UserToUserCommentModel = mongoose.model("UserToUserCommentModel", UserToUserCommentSchema);

/*
 * API DEFINITIONS
 */

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

// retrieve a user based on username
app.get("/getUser/:username", function (req, res){
	UserModel.findOne({username: req.params.username}, function(err, user){
		res.json(user);
	});
});

// retrieve user content for a given Edmunds vehicle ID
app.get("/getCarContent/:vehicleId", function (req, res){
	CarModel.findOne({vehicleId : req.params.vehicleId}, function(err, car){
		res.json(car);
	});
});

// favorite a car, add car ID to user entry and username to car entry
app.post("/favoriteCar/:username/:vehicleId/:vehicleName/:modelYear", function(req, res){
	var newUserToCarFavorite = new UserToCarFavoritesModel({favoritedUsername: req.params.username, edmundsID: req.params.vehicleId});
	newUserToCarFavorite.save();

	// if we don't have this car in our local database yet, add it
	CarModel.findOne({edmundsID : req.params.vehicleId}, function(err, car){
		if (!car)
		{
			// create new car to store in our database to maintain user interactions
			console.log("adding car to favorites" + car)
			var newCar = new CarModel({edmundsID: req.params.vehicleId, vehicleName: req.params.vehicleName, modelYear: req.params.modelYear});
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

// retrieve the car objects that a user likes
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

// retrieve the IDs of the cars the current user has liked
app.get("/getUsersFavoritesIDs/:username", function(req, res){
	var result;

	// find the relational entries
	UserToCarFavoritesModel.find({favoritedUsername: req.params.username}, function(err, relations)
	{
		// get a list of IDs of all cars the user likes from the relations, and find all entries in car model that match the IDs
		result = relations.map(function(item){return item.edmundsID});
		res.json(result);
	});
});

// get the users that have favorited a given car
app.get("/getCarFavorites/:vehicleId", function (req, res){
	UserToCarFavoritesModel.find({edmundsID: req.params.vehicleId}, function(err, relations)
	{
		// get a list of users who like the given car
		UserModel.find({username: {$in: relations.map(function(item){ return item.favoritedUsername})}}, function(err, users){
			// return all matches
			res.json(users);
		});
	});
});

// add user1 to user2's followers
app.post("/follow/:username1/:username2", function(req, res){
	var newFollow = new UserToUserFollowModel({followerUsername: req.params.username1, followingUsername: req.params.username2});
	newFollow.save();

	res.send(200);
});

// unfollow user1 from user2's followers
app.post("/unfollow/:username1/:username2", function(req, res){
	UserToUserFollowModel.remove({followerUsername : req.params.username1, followingUsername: req.params.username2}, function (err, response){
	});

	res.send(200);
});


// retrieve followers of given user
app.get("/getFollowers/:username", function(req, res){
	UserToUserFollowModel.find({followingUsername: req.params.username}, function (err, followers){
		// get a list of users who like the given car
		UserModel.find({username: {$in: followers.map(function(item){ return item.followerUsername})}}, function(err, users){
			// return all user matches
			res.json(users);
		});
	});
});

// retrieve the users followed by a given user
app.get("/getFollowing/:username", function(req, res){
	UserToUserFollowModel.find({followerUsername: req.params.username}, function (err, following){
		// get a list of users who like the given car
		UserModel.find({username: {$in: following.map(function(item){ return item.followingUsername})}}, function(err, users){
			// return all user matches
			res.json(users);
		});
	});
});

// add a comment
app.post("/submitVehicleComment/:username/:vehicleId/:comment", function(req, res){
	var newComment = new UserToCarCommentModel({username: req.params.username, emundsID: req.params.vehicleId, comment: req.params.comment});
	newComment.save();

	res.send(200);
});

// add username1's comment to username2's profile
app.post("/submitUserComment/:username1/:username2/:comment", function(req, res){
	var newComment = new UserToUserCommentModel({username: req.params.username2, commenterUsername: req.params.username1, comment: req.params.comment});
	newComment.save();

	res.send(200);
});

/*

// represent a user/s comment on a user's profile
var UserToUserCommentSchema = new mongoose.Schema({
	username: String,
	commenterUsername: String,
	comment: String,
	date: { type: Date, default: Date.now }
});


// represent a user's comment on a car
var UserToCarCommentSchema = new mongoose.Schema({
	username: String,
	edmundsID: String
	comment: String,
	date: { type: Date, default: Date.now }
});

// represent a user following another user
var UserToUserSchema = new mongoose.Schema({
	followerUsername: String,
	followingUsername: String
});
*/


/*)
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
*/

// get processes running
app.get('/process', function(req, res) {
	res.json(process.env);
});

// define IP and port to listen on 
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ip);

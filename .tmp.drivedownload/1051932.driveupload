'use strict';

const express = require('express');
const app = express();
const jsonParser = require('body-parser').json;
const bodyParser = require('body-parser');
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require('express-session');
const port = process.env.PORT || 5000;
var User = require("./model").User;

//Set the default view engine to pug
app.set('view engine','pug');

app.use(logger("dev"));
app.use(jsonParser());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	secret: 'treehouse loves you',
	resave: true,
	saveUninitialized: false
}));

app.use(function (req, res, next) {
	res.locals.currentUser = req.session.userId;
	next();
});

mongoose.connect("mongodb://localhost:27017/rest");

var db = mongoose.connection;

db.on("error", function(err){
	console.log("connection error:", err);
});

//database
db.once("open", function(){
	console.log("db connection successful");
});

app.get('/login', (req, res, next) => {
	res.render("login");
});

app.post('/login', (req, res, next) => {
	if(req.body.email && req.body.password) {
		var email = req.body.email;
		var password = req.body.password;
		User.authenticate(email, password, function(error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password');
				err.status = 401;
				return res.redirect('/login', err);
				return next(err);
			} else {
				req.session.userId = user._id;
				//console.log(req.session.userId);
				//return res.redirect('/profile/'+user._id+'');
				return res.redirect('/profile');
			}
		});
	} else {
		var err = new Error('Email and password are required!');
		err.status = 401;
		return next(err);
	}
});
//Profile
app.get('/profile', requiresLogin, function(req, res, next){
	res.render('profile');
});

//Logout
app.get('/logout', function(req, res, next) {
	if(req.session) {
		//delete session object
		req.session.destroy(function(err) {
			if(err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

//Retrieve
app.get('/profile/:uID', function(req, res, next){
	User.findById(req.params.uID, function(err, doc){
		if(err) return next(err);
		if(!doc) {
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
		}
		res.json(doc);
		//req.question = doc
		return next();
	});
});
//Update
app.put("/profile/:uID", function(req, res, next){
	User.update({"_id":req.params.uID},{$set: req.body},function(err,result){
		if(err) return next(err);
		res.json(result);
	});
});
//Create
app.post('/register', function(req, res, next){
	var user = new User(req.body);
	user.save(function(err, user){
		if(err) return next(err);
		res.status(201);
		res.json(user);
	});
});

//Delete
app.delete("/profile/:uID", function(req, res, next){
	User.remove({'_id':req.params.uID}, function(err, result){
		if(err) return next(err);
		res.json(result);
	});
});

function requiresLogin(req, res, next){
	if (req.session && req.session.userId) {
		return next();
	} else {
		var err = new Error('You must be logged in to view this page.');
		err.status = 401;
		return next(err);
	}
}

app.listen(port, function(){
	console.log("Express server is listening on port "+port+"!!!");
});
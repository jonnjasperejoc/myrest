'use strict';

var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: String,
	author: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

var UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	favoriteBook: [BookSchema],
	password: {
		type: String,
		required: true
	},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
});

UserSchema.statics.authenticate = function(email, password, callback) {
	User.findOne({ email: email})
		.exec(function (error, user) {
			if(error){
				return callback(error);
			} else if (!user){
				var err = new Error('User not found.');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function(error, result){
				if(result === true){
					return callback(null, user);
				} else {
					return callback();
				}
			});
		});
}

UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, (err, hash) => {
		if(err) {
			return next(err);
		}
		user.password = hash;
		next();
	});
});

var User = mongoose.model('User', UserSchema);
module.exports.User = User;
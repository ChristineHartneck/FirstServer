let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

let studentSchema = mongoose.Schema({
	firstName : { type : String },
	lastName : { type : String },
	id : { 
			type : Number,
			required : true }
});

let userSchema = mongoose.Schema({
	username : { type : String, 
				 required : true, 
				 unique : true },
	password : { type : String,
				 required : true }
});

let Student = mongoose.model( 'Student', studentSchema );
let User = mongoose.model( 'User', userSchema );

let UserList = {
	register : function( user ){
		return User.find( {username : user.username} )
			.then( checkUser => {
				if ( checkUser.length == 0 ){
					return bcrypt.hash(user.password, 10)
				}
			})
			.then( hashPassword =>{
				return User.create({
					username : user.username, 
					password : hashPassword
				})
				.then( newUser => {
					return newUser;
				})
				.catch( error => {
					throw Error( error );
				});
			})
			.catch( error => {
				throw Error( error );
			});
	},
	login : function( user ){
		return User.findOne( {username : user.username} )
			.then( checkUser => {
				if ( checkUser ){
					return bcrypt.compare(user.password, checkUser.password)
				}
			})
			.then( validUser => {
				if( validUser ){
					return "Valid User";
				}
				else{
					throw Error("Invalid User");
				}
			})
			.catch( error => {
				throw Error( error );
			});
	}
};

let StudentList = {
	get : function(){
		return Student.find()
				.then( students => {
					return students;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	getByID : function(id){
		return Student.findOne({id : id})
			.then(student => {
				return student;
			})
			.catch( error => {
				throw Error( error );
			});

	},
	post : function( newStudent ){
		return Student.create( newStudent )
				.then( student => {
					return student;
				})
				.catch( error => {
					throw Error(error);
				});
	},
	put : function( updatedStudent ){
		return StudentList.getByID( updatedStudent.id )
			.then( student => {
				if ( student ){
					return Student.findOneAndUpdate( {id : student.id}, {$set : updatedStudent}, {new : true})
						.then( newStudent => {
							return newStudent;
						})
						.catch(error => {
							throw Error(error);
						});
				}
				else{
					throw Error( "404" );
				}
			})
			.catch( error => {
				throw Error(error);
			});
	}
};

module.exports = { StudentList, UserList };



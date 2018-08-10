"use strict";
const DbService = require("../mixins/db.mixin");
const validation = require("../schemas/user.validation");
const userSchema=require('../schemas/user.schema');
const mDB	= require("moleculer-db");
const databaseDaoError= require("../MyDaoException/MyExceptions");

//const crypto 		= require("crypto");
const bcrypt 		= require("bcrypt");
const jwt 			= require("jsonwebtoken");
const { MoleculerClientError } = require("moleculer").Errors;

module.exports = {
	name: "users",
  mixins:[
    mDB, DbService, validation
  ],

	/**
	 * Service settings
	 */
	settings: {
		JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",
		/** Public fields */
		fields: ['password','email','names','lastnames','rol','company','document_u',
		'document_type','state','country','city', 'description'],

		/** Validator schema for entity */
		entityValidator: userSchema.loginUserRegisteringDataSchema.properties
	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		getAllUsers:{
			params:{
				company:{type:"string"}
			},
			auth: "required",
			handler(ctx){
				return this.Promise.resolve()
					.then(()=>{
						return new Promise((resolve,reject)=>{
							DbService.listUsers((res)=>{
									return resolve(res);
							})
						})
					})
			}
		},
		login:{
			params: {
				user: {
					type: "object",
					props: userSchema.loginUserCredentialsSchema.properties
				}
			},
			handler(ctx) {
			//	const { email, password } = ctx.params.user;
				var user = ctx.params.user;
			//	console.log(user);
				var currentUser=null;

				return this.Promise.resolve()
					.then(()=>{
						let resultValidation=validation.validateUserCredentials(userSchema.loginUserCredentialsSchema, user);
						if(typeof(resultValidation)!='boolean'){
							let er=new databaseDaoError.schemaValidationException('Some data in the body was incorrectly entered', resultValidation[0]);
							return this.Promise.reject(er);
						}
					})
					.then(()=>{
						if(user.email){
							return new Promise((resolve, reject)=>{
								DbService.getUserByEmail(user.email,(res)=>{
									currentUser=res;
									if(!res){
										return reject(new databaseDaoError.validationException('the query did not get any results, email not found','the query did not get any results, email not found'));
									}else if(res['type']==='error' && res['error']['name']==='SequelizeDatabaseError'){
										let er=new databaseDaoError.DataBaseException('The operator doesn\'t exist: character varying = integer, expected varchar type', res['error']['parent']);
										return reject(er);
									}else{
										return resolve();
									}
								});
							})
						}
					})
					.then(()=>{
						return new Promise((resolve, reject)=>{
						  bcrypt.compare(user.password, currentUser.data['password']).then(res => {
						    if(!res){
						      return reject(new databaseDaoError.passwordValidationException('Wrong password!','Wrong password!'));
						    }else{
						      const payload = {
						          email: currentUser.data['email'],
						          admin: currentUser.data['state'],
						          organization: currentUser.data['company']
						      };
						      const generatedToken = jwt.sign(payload, this.settings.JWT_SECRET, {expiresIn:60});
						      return resolve({"your-token": generatedToken});
						    }
						  })
						});
					})
			}
		},
		signup: {
			auth: "required",
			params: {
				user:{type:"object"}
			},
			handler(ctx) {
				console.log(ctx.meta.user)
				let entity = ctx.params.user;
				if(ctx.meta.user.rol===1){
					return this.validateEntity(entity)
						.then(() => {
							if (entity.email){
								return new Promise((resolve, reject)=>{
									DbService.getUserByEmail(entity.email,(res)=>{
										if(!res){
											return resolve()
											//return reject(new databaseDaoError.validationException('the query did not get any results, email not found','the query did not get any results, email not found'));
										}else if(res['type']==='error' && res['error']['name']==='SequelizeDatabaseError'){
											let er=new databaseDaoError.DataBaseException('The operator doesn\'t exist: character varying = integer, expected varchar type', res['error']['parent']);
											return reject(er);
										}else{
											return reject(new databaseDaoError.validationException('Email '+entity.email+ ' is already in use','Email '+entity.email+ ' is already in use'));
											//return resolve();
										}
									});
								});
							}
						})
						.then(()=>{
							entity.password = bcrypt.hashSync(entity.password, 10);
							return new Promise(function(resolve, reject) {
								DbService.createUser(entity,(res)=>{
									if(res['type']==='error'&&res['error']['name']==='SequelizeValidationError'){
										let er=new databaseDaoError.validationException('not null violation: some mandatory fields were not entered', res['error']['errors']);
										return reject(er);
									}else if(res['type']==='error'&&res['error']['name']==='SequelizeForeignKeyConstraintError'){
										let er=new databaseDaoError.foreignKeyException('Foreign Key error: Insert or update in any table violates a foreign key', 'Foreign Key error: Insert or update in any table violates a foreign key');
										return reject(er);
									}else if(res['type']==='error'&&res['error']['name']==='SequelizeUniqueConstraintError'){
										let er=new databaseDaoError.uniqueConstraintException('Primary Key error: duplicate key violates uniqueness restriction', 'Primary Key error: duplicate key violates uniqueness restriction');
										return reject(er);
									}else{
										delete res.data.password;
										return resolve(res);
									}
								});
							});
						})
						.catch((err)=>{
							let er=new databaseDaoError.schemaValidationException('Some data in the body was incorrectly entered', err.data);
							return Promise.reject(er);
						});
				}else{
					let er=new databaseDaoError.allowedRolException('The current user doesn\'t have permission for to create users', 'The current user doesn\'t have permission for to create users');
					return Promise.resolve(this.generateDataError(er, 'AllowedRolException'));
				}

			}
		},
		resolveToken: {
			cache: {
				keys: ["token"],
				ttl: 60 * 60 // 1 hour
			},
			params: {
				token: "string"
			},
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
						//console.log(decoded)
						if (err)
							return reject(err);
						resolve(decoded);
					});

				})
				.then(decoded => {
					if (decoded.email)
						return new Promise((resolve,reject)=>{
							DbService.getUserByEmail(decoded.email, (user)=>{
								return resolve(user);
							});
						})
				})
			}
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		generateDataError(errorG, nameG){
			let error={
				error:{
					code:errorG.code,
					type:errorG.type,
					data:errorG.data,
					name: nameG
				}
			};
			console.log('entrooooooooooooo')
			console.log(error)
			return (error);
		}

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};

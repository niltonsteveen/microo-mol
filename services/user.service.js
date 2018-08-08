"use strict";
const DbService = require("../mixins/db.mixin");
const validation = require("../schemas/user.validation");
const userSchema=require('../schemas/user.schema');
const mDB	= require("moleculer-db");

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
							return this.Promise.reject(new MoleculerClientError("Entity validation error!",
							422, "", [{field: 'message', message:'Either username or password was incorrectly entered'},{ field: "details", message: resultValidation[0]}]));
						}
					})
					.then(()=>{
						if(user.email){
							return new Promise((resolve, reject)=>{
								DbService.getUserByEmail(user.email,(res)=>{
									currentUser=res;
									if(!res){
										return reject(new MoleculerClientError("email doesn't exist!",
										422, "", [{field: 'message', message:'User with email: '+user.email+ ' doesn\'t exist'}]));
									}else {
										return resolve();
									}
								});
							})
						}
					})
					.then(()=>{
						return new Promise((resolve, reject)=>{
						  bcrypt.compare(user.password, currentUser.password).then(res => {
						    if(!res){
						      return reject(new MoleculerClientError("Wrong password!", 422, "", [{ field: "error", message: "Wrong password!"}]));
						    }else{
						      const payload = {
						          email: currentUser.email,
						          admin: currentUser.state,
						          organization: currentUser.company
						      };
						      const generatedToken = jwt.sign( payload, this.settings.JWT_SECRET);
						      return resolve({"your-token": generatedToken});
						    }
						  })
						});
					})
			}
		},
		signup: {
			params: {
				user:{type:"object"}
			},
			handler(ctx) {
				//sync()

				let entity = ctx.params.user;
				return this.validateEntity(entity)
					.then(() => {
						console.log('huy hasta q entro')
						if (entity.email){
							return new Promise((resolve, reject)=>{
								DbService.getUserByEmail(entity.email,(res)=>{
									if(res){
										return reject(new MoleculerClientError("Email is exist!",
										422, "", [{field: 'message', message:'Email '+entity.email+ ' is already in use'}]));
									}
								});
							});
						}
					})
					.then(()=>{
						entity.password = bcrypt.hashSync(entity.password, 10);
						return new Promise(function(resolve, reject) {
							DbService.createUser(entity,(result)=>{
								console.log(result);
								return resolve(result);
							});
						});
					})
					.catch((err)=>{
						return Promise.reject(new MoleculerClientError("Entity validation error!",
						422, err['type'], [{field: 'message', message:'Some data for new user were incorrectly entered'},{ field: "details", message: err.data}]));
					});
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
						if (err)
							return reject(err);

						resolve(decoded);
					});

				})
					.then(decoded => {
						console.log(decoded);
						/*if (decoded.id)
							return this.getById(decoded.id);*/
					});
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

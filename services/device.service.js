"use strict";
const DbService = require("../mixins/db-topology.mixin");
const validation = require("../schemas/device/device.validation");
const deviceSchema=require('../schemas/device/device.schema');
const mDB	= require("moleculer-db");
const databaseDaoError= require("../MyDaoException/MyExceptions");

module.exports = {
	name: "devices",
  mixins:[
    mDB, DbService, validation
  ],

	/**
	 * Service settings
	 */
	settings: {
    JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",
	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		insertDevice:{
			auth: "required",
			params: {
				devices:{type:"array"}
			},
			handler(ctx) {
				var devices = ctx.params.devices;
				console.log(devices)

				return this.Promise.resolve()
					.then(()=>{
						let resultValidation=validation.devicesDataValidator(devices);
						if(!resultValidation){
							let er=new databaseDaoError.schemaValidationException('Some data in the body was incorrectly entered', validation.devicesDataValidator.errors);
							return this.Promise.reject(er);
						}
					})
					.then(()=>{
						
					})
			}
		}
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

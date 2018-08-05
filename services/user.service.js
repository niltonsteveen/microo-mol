"use strict";
const DbService = require("../mixins/db.mixin");
const validation = require("../schemas/user.validation");

//const crypto 		= require("crypto");
const bcrypt 		= require("bcrypt");
const jwt 			= require("jsonwebtoken");
const { MoleculerClientError } = require("moleculer").Errors;

module.exports = {
	name: "users",
  mixins:[
    DbService, validation
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

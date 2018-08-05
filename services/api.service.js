"use strict";

const _ = require("lodash");
const ApiGateway = require("moleculer-web");
const { UnAuthorizedError } = ApiGateway.Errors;


module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,
		cors: {
        // Configures the Access-Control-Allow-Origin CORS header.
        origin: "*",
        // Configures the Access-Control-Allow-Methods CORS header.
        methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
        // Configures the Access-Control-Allow-Headers CORS header.
        allowedHeaders: [],
        // Configures the Access-Control-Expose-Headers CORS header.
        exposedHeaders: [],
        // Configures the Access-Control-Allow-Credentials CORS header.
        credentials: false,
        // Configures the Access-Control-Max-Age CORS header.
        maxAge: 3600
    },
		routes: [{
			path: "/api/users",
			authorization: true,

			aliases: {
				//login
				"POST /login": "users.login",

				//user's actions
				"POST /sign_up": "users.signup",
				"GET /user_by_id": "users.getUserByEmail",
				"GET /allUsers": "users.getAllUsers"
			},
			mappingPolicy: "restrict",
			bodyParsers: {
				json: {
					strict: false
				},
				urlencoded: {
					extended: false
				}
			},
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**"
			]
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public"
		},

		onError(req, res, err) {
			// Return with the error as JSON object
			res.setHeader("Content-type", "application/json; charset=utf-8");
			res.writeHead(err.code || 500);

			if (err.code == 422) {
				let o = {};
				err.data.forEach(e => {
					let field = e.field.split(".").pop();
					o[field] = e.message;
				});
				res.end(JSON.stringify({ errors: o }, null, 2));
			} else {
				const errObj = _.pick(err, ["name", "message", "code", "type", "data"]);
				res.end(JSON.stringify(errObj, null, 2));
			}
			this.logResponse(req, res, err? err.ctx : null);
		}
	},
	methods: {
		/**
		 * Authorize the request
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		authorize(ctx, route, req) {
			let token;
			if (req.headers.authorization) {
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token" || type === "Bearer")
					token = req.headers.authorization.split(" ")[1];
			}

			return this.Promise.resolve(token)
				.then(token => {
					if (token) {
						// Verify JWT token
						return ctx.call("users.resolveToken", { token })
							.then(user => {
								if (user) {
									this.logger.info("Authenticated via JWT: ", user.email);
									// Reduce user fields (it will be transferred to other nodes)
									ctx.meta.user = _.pick(user, ["email", "names", "organization", "state"]);
									ctx.meta.token = token;
									ctx.meta.userID = user.email;
								}
								return user;
							})
							.catch(err => {
								// Ignored because we continue processing if user is not exist
								return null;
							});
					}
				})
				.then(user => {
					if (req.$action.auth == "required" && !user)
						return this.Promise.reject(new UnAuthorizedError());
				});
		}
	}
};

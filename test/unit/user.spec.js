"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
var assert = require('assert');
const DBService = require('../../mixins/db.mixin');
describe("Test 'user' service", () => {
	describe("Test create user", () => {

		it("should return with 'true' value", (done) => {
			let user={
				email: 'nilton.velez@udea.edu.co',
				names:'nilton steveen',
				lastnames: 'velez garcia',
				document_u: 1017233591,
				document_type: 1,
				rol: 1,
				company: 1,
				password: 'Hesoyam22',
				state: true
			}
			let iscreated;
			DBService.createModelDataBase((res)=>{
				//console.log(res);
				/*DBService.createUser(user,function(res1){
					console.log('fasdfasfdsa'+res1);
					assert.equal(res1, false);
					done();
				});*/
			});
		});

	});
});

"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const databaseDaoError= require("../../MyDaoException/MyExceptions");

var assert = require('assert');
const DBService = require('../../mixins/db.mixin');
const expect = require('chai').expect;

beforeEach(function() {
	console.log('antes de todo')
	return DBService.createModelDataBase(()=>{
		return
	});
});

describe("Test 'user' service", () => {
	describe("Test create user", () => {
		it("Test to create users without mandatory user parameters, should return with 'true' value", (done) => {
			let user={
			};
			DBService.createUser(user,(res)=>{
				if(res['type']==='error'&&res['error']['name']==='SequelizeValidationError'){
					let er=new databaseDaoError.validationException('not null violation: some mandatory fields were not entered', res['error']['errors']);
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
		});

		it("Test to create users with params incorrect format, should return with 'true' value", (done) => {
			let user={
				email: 'nilton.velezudea.edu.co',
				names:'nilton steveen',
				lastnames: 653563653,
				document_u: 1017233591,
				document_type: 1,
				rol: 1,
				company: 2,
				password: 'Hesoyam22',
				state: 'fdsa'
			};
			DBService.createUser(user,(res)=>{
				if(res['type']==='error'&&res['error']['name']==='SequelizeValidationError'){
					let er=new databaseDaoError.validationException('Validation error: some fields have validation errors', res['error']['errors']);
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
		});

		it("Test to create users with foreignKey incorrect, should return with 'true' value", (done) => {
			let user={
				email: 'nilton.velez@udea.edu.co',
				names:'nilton steveen',
				lastnames: 'fadfda',
				document_u: 1017233591,
				document_type: 3,
				rol: 1,
				company: 2,
				password: 'Hesoyam22',
				state: true
			};
			DBService.createUser(user,(res)=>{
			//	console.log(res);
				if(res['type']==='error'&&res['error']['name']==='SequelizeForeignKeyConstraintError'){
					let er=new databaseDaoError.foreignKeyException('Foreign Key error: Insert or update in any table violates a foreign key', res['error']['parent']);
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
		});


		it("Test to create duplicate user, should return with 'true' value", (done) => {
			let user={
				email: 'admin@correo.com',
				names:'nilton steveen',
				lastnames: 'fadfda',
				document_u: 1017233591,
				document_type: 2,
				rol: 1,
				company: 2,
				password: 'Hesoyam22',
				state: true
			};
			DBService.createUser(user,(res)=>{
			//	console.log(res);
				if(res['type']==='error'&&res['error']['name']==='SequelizeUniqueConstraintError'){
					let er=new databaseDaoError.uniqueConstraintException('Primary Key error: duplicate key violates uniqueness restriction', res['error']['parent']);
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
		});

		it("Test to create correct user, should return with 'true' value", (done) => {
			let user={
				email: 'nilton.velez@udea.edu.co',
				names:'nilton steveen',
				lastnames: 'velez garcia',
				document_u: 1017233591,
				document_type: 2,
				rol: 1,
				company: 2,
				password: 'Hesoyam22',
				state: true
			};
			DBService.createUser(user,(res)=>{
			//	console.log(res);
				if(res['type']==='error'&&res['error']['name']==='SequelizeUniqueConstraintError'){
					let er=new databaseDaoError.uniqueConstraintException('Primary Key error: duplicate key violates uniqueness restriction', res['error']['parent']);
					assert.ok(false);
					done();
				}else{
					assert.ok(true);
					done();
				}
			});
		});

	});


	describe("Test get user by email", () => {
		it("Test to get user by email with null parameter, should return with 'true' value", (done) => {
			DBService.getUserByEmail(null,(res)=>{
				console.log(res);
				assert.equal(res,null);
				done();
			});
		});

		it("Test to get user by email with invalid parameter, should return with 'true' value", (done) => {
			DBService.getUserByEmail(45435432,(res)=>{
				if(res['type']==='error' && res['error']['name']==='SequelizeDatabaseError'){
					let er=new databaseDaoError.DataBaseException('The operator doesn\'t exist: character varying = integer, expected varchar type', res['error']['parent']);
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
		});

		it("Test to get user by email without domain, should return with 'true' value", (done) => {
			DBService.getUserByEmail('fdsafdsafdsa',(res)=>{
				if(!res){//null
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
		});
	});

	describe("Test get all users", () => {
		it("Test to get all users with your organization", (done) => {
			DBService.listUsers((res)=>{
				console.log(res);
				assert.ok(true);
				done();
			});
		});
	});

});

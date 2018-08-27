"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const databaseDaoError= require("../../MyDaoException/MyExceptions");

var assert = require('assert');
const DBService = require('../../mixins/db-topology.mixin');
const expect = require('chai').expect;
let sync=require('sync');

beforeEach(function() {
	return DBService.createModelDataBase(()=>{
		return
	});
});

describe("Test 'device' service", () => {
	describe("Test create device", () => {
   it("Test to create device without mandatory device parameters, should return with 'true' value", (done) => {
		 sync(function(){
			 let device={};
       let res=DBService.insertDevice.sync(null,device);
       let er=new databaseDaoError.validationException('not null violation: some mandatory fields were not entered', res['error']['errors']);
       assert.equal(er.type, 'Validation_Error')
       done();
		 });
    });

    it("Test to create devices with params incorrect format, should return with 'true' value", (done) => {
			sync(function(){
				let device={
					ip: 'nilton.velezudea.edu.co',
					name:'nilton steveen',
					netmask: 653563653,
					model: 1017233591,
					gateway: 1,
					manufacturer: 1,
					mac: 2,
					type: 'Hesoyam22',
					state: 'fdsa'
				};
				let res=DBService.insertDevice.sync(null,device);
	      let er=new databaseDaoError.validationException('Validation error: some fields have validation errors', res['error']['errors']);
	      assert.equal(er.type, 'Validation_Error')
	      done();
			});
    });

    it("Test to create devices with foreignKey incorrect, should return with 'true' value", (done) => {
			sync(function(){
				let device={
					ip: ('192.168.1.15'),
					name:'SEL_12_15',
					netmask: ('255.255.255.0'),
					model: '2018',
					gateway: ('182.32.25.255'),
					manufacturer: 'SEL',
					mac: ('AB:56:78:EF:19:45'),
					type: 'HOSTTTTT',
					state: 'PENDING'
				};
				let res=DBService.insertDevice.sync(null,device);
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

    it("Test to create devices with enum input incorrect, should return with 'true' value", (done) => {
			sync(function(){
				let device={
					ip: ('192.168.1.12'),
					name:'SEL_12_1',
					netmask: ('255.255.255.0'),
					model: '2018',
					gateway: ('182.32.25.255'),
					manufacturer: 'SEL',
					mac: ('AB:56:78:EF:12:45'),
					type: 'HOST',
					state: 'PErgNDING'
				};
				let res=DBService.insertDevice.sync(null,device);
				if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
					let er=new databaseDaoError.DataBaseException('Input for enum doesn\'t exist: Invalid input value for enum', res['error']['parent']);
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
		});

		it("Test to create device with duplicated unique fields, should return with 'true' value", (done) => {
			sync(function(){
				let device={
					ip: ('192.168.1.12'),
					name:'SEL_12_1',
					netmask: ('255.255.255.0'),
					model: '2018',
					gateway: ('182.32.25.255'),
					manufacturer: 'SEL',
					mac: ('AB:56:78:EF:12:45'),
					type: 'HOST',
					state: 'PENDING'
				};
				let res=DBService.insertDevice.sync(null,device);
				if(res['type']==='error'&&res['error']['name']==='SequelizeUniqueConstraintError'){
					let er=new databaseDaoError.uniqueConstraintException('Duplicated unique fields: duplicate key(s) violates uniquene constraint', res['error']['parent']);
					assert.ok(true);
					done();
				}else{
					assert.ok(false);
					done();
				}
			});
    });

    it("Test to create correct device, should return with 'true' value", (done) => {
			sync(function(){
				let device={
					ip: '192.168.1.13',
					name:'SEL_12_12',
					netmask: ('255.255.255.0'),
					model: '2018',
					gateway: ('182.32.25.255'),
					manufacturer: 'SEL',
					mac: ('AB:56:78:EF:12:46'),
					type: 'HOST',
					state: 'PENDING'
				};
				let res=DBService.insertDevice.sync(null,device);
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

		describe("Test get device by Id", () => {
	  	it("Test to get device by id without mandatory device parameter, should return with 'true' value", (done) => {
				let deviceId=null;
				DBService.getDeviceById(deviceId,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get device by id with incorrect value column, should return with 'true' value", (done) => {
				let param='gsfdgsd';
				DBService.getDeviceById(param,(res)=>{
					if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
						let er=new databaseDaoError.DataBaseException('Invalid input syntax for integer: '+param, res['error']['parent']);
						assert.ok(true);
						done();
					}else{
						assert.ok(false);
						done();
					}
				});
			});

			it("Test to get device by id non-existent, should return with 'true' value", (done) => {
				let deviceId=4;
				DBService.getDeviceById(deviceId,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get device by id existent, should return with 'true' value", (done) => {
				let deviceId=1;
				DBService.getDeviceById(deviceId,(res)=>{
					if(!res['data']){
						assert.ok(false)
						done();
					}else{
						assert.ok(true)
						done();
					}
				});
			});
		});

		describe("Test get device by Name", () => {
	  	it("Test to get device by name without mandatory device parameter, should return with 'true' value", (done) => {
				let deviceName=null;
				DBService.getDeviceByName(deviceName,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get device by name with incorrect value column, should return with 'true' value", (done) => {
				let param=432178;
				DBService.getDeviceByName(param,(res)=>{
					if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
						let er=new databaseDaoError.DataBaseException('Operator does not exist: character varying = integer', res['error']['parent']);
						assert.ok(true);
						done();
					}else{
						assert.ok(false);
						done();
					}
				});
			});

			it("Test to get device by name non-existent, should return with 'true' value", (done) => {
				let deviceName='fdsfsafsda';
				DBService.getDeviceByName(deviceName,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get device by name existent, should return with 'true' value", (done) => {
				let deviceName="SEL_12_1";
				DBService.getDeviceByName(deviceName,(res)=>{
					if(!res['data']){
						assert.ok(false)
						done();
					}else{
						assert.ok(true)
						done();
					}
				});
			});
		});

		describe("Test get device by ip", () => {
	  	it("Test to get device by ip without mandatory device parameter, should return with 'true' value", (done) => {
				let deviceIp=null;
				DBService.getDeviceByIp(deviceIp,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get device by ip with incorrect value column, should return with 'true' value", (done) => {
				let param=432178;
				DBService.getDeviceByIp(param,(res)=>{
					if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
						let er=new databaseDaoError.DataBaseException('Operator does not exist: inet = integer', res['error']['parent']);
						assert.ok(true);
						done();
					}else{
						assert.ok(false);
						done();
					}
				});
			});

			it("Test to get device by ip non-existent, should return with 'true' value", (done) => {
				let deviceIp='192.32.36.25';
				DBService.getDeviceByIp(deviceIp,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get device by ip existent, should return with 'true' value", (done) => {
				let deviceIp="192.168.1.12";
				DBService.getDeviceByIp(deviceIp,(res)=>{
					if(!res['data']){
						assert.ok(false)
						done();
					}else{
						assert.ok(true)
						done();
					}
				});
			});
		});

		describe("Test get devices by manufacturer", () => {
	  	it("Test to get devices by manufacturer without mandatory device parameter, should return with 'true' value", (done) => {
				let deviceManufacturer=null;
				DBService.getDevicesByManufacturer(deviceManufacturer,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get devices by manufacturer with incorrect value column, should return with 'true' value", (done) => {
				let param=432178;
				DBService.getDevicesByManufacturer(param,(res)=>{
					if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
						let er=new databaseDaoError.DataBaseException('Operator does not exist: character varying = integer', res['error']['parent']);
						assert.ok(true);
						done();
					}else{
						assert.ok(false);
						done();
					}
				});
			});

			it("Test to get devices by manufacturer non-existent, should return with 'true' value", (done) => {
				let param='hfdfsaf';
				DBService.getDevicesByManufacturer(param,(res)=>{
					if(!res['data']){
						assert.ok(true)
						done();
					}else{
						assert.ok(false)
						done();
					}
				});
			});

			it("Test to get devices by manufacturer existent, should return with 'true' value", (done) => {
				let param="SEL";
				DBService.getDevicesByManufacturer(param,(res)=>{
					if(!res['data']){
						assert.ok(false)
						done();
					}else{
						assert.ok(true)
						done();
					}
				});
			});
		});

		describe("Test get all devices", () => {
	  	it("Test to get all devices, should return with 'true' value", (done) => {
				DBService.getAllDevices((res)=>{
					console.log(res)
					if(!res['data']){
						assert.ok(false)
						done();
					}else{
						assert.ok(true)
						done();
					}
				});
			});
		});

  })
})

"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const databaseDaoError= require("../../MyDaoException/MyExceptions");

var assert = require('assert');
const DBService = require('../../mixins/db-topology.mixin');
const expect = require('chai').expect;

beforeEach(function() {
	console.log('antes de todo')
	return DBService.createModelDataBase(()=>{
		return
	});
});

describe("Test 'device' service", () => {
	describe("Test create device", () => {
   it("Test to create device without mandatory user parameters, should return with 'true' value", (done) => {
      let device={};
      DBService.insertDevice(device,(res)=>{
        let er=new databaseDaoError.validationException('not null violation: some mandatory fields were not entered', res['error']['errors']);
        assert.equal(er.type, 'Validation_Error')
        done();
      })
    });

    it("Test to create devices with params incorrect format, should return with 'true' value", (done) => {
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
			DBService.insertDevice(device,(res)=>{
        let er=new databaseDaoError.validationException('Validation error: some fields have validation errors', res['error']['errors']);
        assert.equal(er.type, 'Validation_Error')
        done();
      });
    });

    it("Test to create devices with foreignKey incorrect, should return with 'true' value", (done) => {
      let device={
				ip: ('192.168.1.15'),
				name:'SEL_12_15',
				netmask: ('255.255.255.0'),
				model: '2018',
				gateway: ('182.32.25.255'),
				manufacturer: 'SEL',
				mac: ('AB:56:78:EF:14:45'),
				type: 'HOSTTTTT',
				state: 'PENDING'
			};
			DBService.insertDevice(device,(res)=>{
      //  console.log(res)
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
			DBService.insertDevice(device,(res)=>{
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

    it("Test to create correct device, should return with 'true' value", (done) => {
      let device={
				ip: ('192.168.1.13'),
				name:'SEL_12_12',
				netmask: ('255.255.255.0'),
				model: '2018',
				gateway: ('182.32.25.255'),
				manufacturer: 'SEL',
				mac: ('AB:56:78:EF:12:46'),
				type: 'HOST',
				state: 'PENDING'
			};
      DBService.insertDevice(device,(res)=>{
      //  console.log(res);
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

    it("Test to create device with duplicated unique fields, should return with 'true' value", (done) => {
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
      DBService.insertDevice(device,(res)=>{
        console.log(res);
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

  })
})

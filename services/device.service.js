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
		//dbser: DbService
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
		getAllDevices:{
			auth: "required",
			handler(ctx) {
				return new Promise((resolve, reject)=>{
					DbService.getAllDevices((res)=>{
						return resolve(res);
					});
				});
			}
		},
		getDevicesByManufacturer:{
			auth: "required",
			params:{
				deviceManufacturer:{type:'string'}
			},
			handler(ctx) {
				var deviceManufacturer=ctx.params.deviceManufacturer;
				return new Promise((resolve, reject)=>{
					DbService.getDevicesByManufacturer(deviceManufacturer,(res)=>{
						if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
							let er=new databaseDaoError.DataBaseException('Input entered is not a string valid: Operator does not exist', 'Input entered is not a string valid: Operator does not exist');
							return resolve({type:'error', data:er});
						}else{
							return resolve(res);
						}
					});
				});
			}
		},
		getDeviceByIp:{
			auth: "required",
			params:{
				deviceIp:{type:'string'}
			},
			handler(ctx) {
				var deviceIp=ctx.params.deviceIp;
				return new Promise((resolve, reject)=>{
					DbService.getDeviceByIp(deviceIp,(res)=>{
						if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
							let er=new databaseDaoError.DataBaseException('Input entered is not valid: Operator does not exist: inet = integer', 'Input entered is not valid: Operator does not exist: inet = integer');
							return resolve({type:'error', data:er});
						}else{
							return resolve(res);
						}
					});
				});
			}
		},
		getDeviceByName:{
			auth: "required",
			params:{
				deviceName:{type:'string'}
			},
			handler(ctx) {
				var deviceName=ctx.params.deviceName;
				return new Promise((resolve, reject)=>{
					DbService.getDeviceByName(deviceName,(res)=>{
						if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
							let er=new databaseDaoError.DataBaseException('Operator does not exist: character varying = integer', 'Operator does not exist: character varying = integer');
							return resolve({type:'error', data:er});
						}else{
							return resolve(res);
						}
					});
				});
			}
		},
		getDeviceById:{
			auth: "required",
			params:{
				deviceId:{type:'string'}
			},
			handler(ctx) {
				var deviceId=Number(ctx.params.deviceId);
				return new Promise((resolve, reject)=>{
					DbService.getDeviceById(deviceId,(res)=>{
						if(res['type']==='error'&&res['error']['name']==='SequelizeDatabaseError'){
							let er=new databaseDaoError.DataBaseException('Invalid input syntax for integer: '+ctx.params.deviceId, 'Invalid input syntax for integer: '+ctx.params.deviceId);
							return resolve({type:'error', data:er});
						}else{
							return resolve(res);
						}
					});
				});
			}
		},
		insertDevice:{
			auth: "required",
			params: {
				devices:{type:"array"}
			},
			handler(ctx) {
				var devices = ctx.params.devices;
				return this.Promise.resolve()
					.then(()=>{
						let resultValidation=validation.devicesDataValidator(devices);
						if(!resultValidation){
							let er=new databaseDaoError.schemaValidationException('Some data in the body was incorrectly entered', validation.devicesDataValidator.errors);
							return this.Promise.reject(er);
						}
					})
					.then(()=>{
						if(!devices||devices.length==0){
							let er=new databaseDaoError.schemaValidationException('The array cann\'t be empty or null', 'The array cann\'t be empty or null');
							return this.Promise.reject(er);
						}
					})
					.then(()=>{
						let devicesOk=[];
						let devicesWithErrors=[];
						//console.log(DbService)
						return new Promise((resolve, reject)=>{
							DbService.processArrayDevices(devices,(res)=>{
									return resolve(res);
							});
						});
					});
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

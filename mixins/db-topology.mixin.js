const Sequelize = require('sequelize');
let sync=require('sync');
const databaseDaoError= require("../MyDaoException/MyExceptions");
const bcrypt 		= require("bcrypt");
const database='topology_management';
const username='postgres';
const password='root';
const host='localhost';
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});
var device_model=undefined;
var type_d=undefined;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
createModelDataBase((res)=>{

});



function createModelDataBase(callback) {
  console.log('a modelos')

  device_model = sequelize.define('device', {
    ip: {
      type:Sequelize.INET,
      allowNull:false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len: [3,30]
      },
      unique: true
    },
    netmask:{
      type:Sequelize.INET,
      allowNull:false,
    },
    model:{
      type: Sequelize.STRING,
      allowNull:true,
      validate:{
        len: [3,30]
      }
    },
    gateway:{
      type:Sequelize.INET,
      allowNull:false,
    },
    manufacturer:{
      type: Sequelize.STRING,
      allowNull:true,
      validate:{
        len: [3,30]
      }
    },
    mac:{
      type:Sequelize.MACADDR,
      allowNull:false,
      unique: true
    },
    type:{
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len: [3,30]
      }
    },
    id:{
      type:Sequelize.INTEGER,
      allowNull:false,
      autoIncrement: true,
      primaryKey:true
    },
    state:{
      type: Sequelize.ENUM('INSTALLED', 'PENDING')
    }
  },{timestamps: false, tableName: 'device'}, {
    indexes:[{
      unique: true,
      fields: ['mac', 'name', 'ip']
    }]
  });

  type_d=sequelize.define('type_device', {
    name: {
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len: [3,30]
      },
      primaryKey:true
    }
  },{timestamps: false, tableName: 'type_device'});

  type_d.hasMany(device_model, {foreignKey: 'type', sourceKey: 'name'});
  device_model.belongsTo(type_d, {foreignKey: 'type', targetKey: 'name'});

  sequelize.sync().then(()=>{
    type_d.create({name:'HOST'}).then(() => type_d.findOrCreate({where: {name: 'HOST'}}))
      .spread((type, created) => {}).catch((err)=>{

      });

    type_d.create({name:'IED'}).then(() => type_d.findOrCreate({where: {name: 'IED'}}))
      .spread((type, created) => {}).catch((err)=>{

      });
    type_d.create({name:'SERVER'}).then(() => type_d.findOrCreate({where: {name: 'SERVER'}}))
      .spread((type, created) => {}).catch((err)=>{

      });

    type_d.create({name:'GATEWAY'}).then(() => type_d.findOrCreate({where: {name: 'GATEWAY'}}))
      .spread((type, created) => {}).catch((err)=>{

      });

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

      deleteDevice('SEL_12_12');


    insertDevice(device,(res)=>{

    });
    callback(true);
  });
}

function deleteDevice(nameId) {
  device_model.destroy({
    where: {
      name: nameId
    }
  });
}

function processArrayDevices(array, callback) {
  sync(function(){
    let devicesOk=[];
    let devicesWithErrors=[];
    array.forEach((item)=>{
      let res=insertDevice.sync(null,item);
      if(res['type']==='error'){
        var er;
        var processedError;
        if(res['error']['name']==='SequelizeValidationError'){
          er=new databaseDaoError.validationException('Validation error: some fields have validation errors', res['error']['errors']);
          processedError=databaseDaoError.generateDataError(er, 'ValidationException');
        }else if(res['error']['name']==='SequelizeForeignKeyConstraintError'){
          er=new databaseDaoError.foreignKeyException('Foreign Key error: Insert or update in any table violates a foreign key', res['error']['parent']);
          processedError=databaseDaoError.generateDataError(er, 'ForeignKeyException');
        }else if(res['error']['name']==='SequelizeDatabaseError'){
          er=new databaseDaoError.DataBaseException('Input for enum doesn\'t exist: Invalid input value for enum', res['error']['parent']);
          processedError=databaseDaoError.generateDataError(er, 'DataBaseException');
        }else if(res['error']['name']==='SequelizeUniqueConstraintError'){
          er=new databaseDaoError.uniqueConstraintException('Primary Key error: duplicate key violates uniqueness restriction', res['error']['parent']);
          processedError=databaseDaoError.generateDataError(er, 'UniqueConstraintException');
        }
        let result={
            device:item,
            details:processedError
        };
        devicesWithErrors.push(result);
      }else{
        devicesOk.push(item);
      }
    });
    let message_error;
    if(devicesWithErrors.length>0){
      message_error='The request was processed correctly with errors';
    }else{
      message_error='The request was processed correctly without errors';
    }
    let response={
      "message":message_error,
      "devices-installed": devicesOk,
      "device-with-errors": devicesWithErrors
    };
    callback (response);
  })
}

function insertDevice(device, callback){
  device_model.create({ ip: device.ip, name: device.name, netmask: device.netmask,
  model: device.model, gateway: device.gateway, manufacturer: device.manufacturer,
  mac: device.mac, id: device.id, state: device.state, type:device.type})
  .then(() => device_model.findOrCreate({where: {name: device.name}}))
  .spread((result, created) => {
    let res={
      type: 'success',
      message: 'The device'+ result.name + ' was registered successfully',
      data: result.dataValues
    };
    callback(null,res);
  }).catch((err)=>{
    //console.log(err)
    let error={
      type:'error',
      error: err
    };
    callback(null,error);
  });
}

function getDeviceById(param, callback) {
  device_model.findAll({ where: { id: param}, raw: true }).then((devices)=>{
    if(devices.length>0){
      let successData={
        type:'success',
        data: devices[0]
      };
      callback(successData);
    }else{
      let successData={
        type:'success',
        message: 'The requested query did not get results'
      };
      callback(successData);
    }
  }).catch((err)=>{
    let error={
      type:'error',
      error: err
    };
    callback(error);
  })
}

function getDeviceByName(param, callback) {
  device_model.findAll({ where: { name: param}, raw: true }).then((devices)=>{
    if(devices.length>0){
      let successData={
        type:'success',
        data: devices[0]
      };
      callback(successData);
    }else{
      let successData={
        type:'success',
        message: 'The requested query did not get results'
      };
      callback(successData);
    }
  }).catch((err)=>{
    let error={
      type:'error',
      error: err
    };
    callback(error);
  })
}

function getDeviceByIp(param, callback) {
  device_model.findAll({ where: { ip: param}, raw: true }).then((devices)=>{
    if(devices.length>0){
      let successData={
        type:'success',
        data: devices[0]
      };
      callback(successData);
    }else{
      let successData={
        type:'success',
        message: 'The requested query did not get results'
      };
      callback(successData);
    }
  }).catch((err)=>{
    let error={
      type:'error',
      error: err
    };
    callback(error);
  })
}

function getDevicesByManufacturer(param, callback) {
  device_model.findAll({ where: { manufacturer: param}, raw: true }).then((devices)=>{
    if(devices.length>0){
      let successData={
        type:'success',
        data: devices
      };
      callback(successData);
    }else{
      let successData={
        type:'success',
        message: 'The requested query did not get results'
      };
      callback(successData);
    }
  }).catch((err)=>{
    let error={
      type:'error',
      error: err
    };
    callback(error);
  })
}

function getAllDevices(callback) {
  device_model.findAll({raw: true }).then((devices)=>{
    if(devices.length>0){
      let successData={
        type:'success',
        data: devices
      };
      callback(successData);
    }else{
      let successData={
        type:'success',
        message: 'The requested query did not get results'
      };
      callback(successData);
    }
  }).catch((err)=>{
    let error={
      type:'error',
      error: err
    };
    callback(error);
  })
}

module.exports={
  createModelDataBase:createModelDataBase,
  insertDevice:insertDevice,
  processArrayDevices:processArrayDevices,
  deleteDevice:deleteDevice,
  getDeviceById:getDeviceById,
  getDeviceByName:getDeviceByName,
  getDeviceByIp:getDeviceByIp,
  getDevicesByManufacturer:getDevicesByManufacturer,
  getAllDevices:getAllDevices
}

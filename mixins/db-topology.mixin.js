const Sequelize = require('sequelize');
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
    },
    name: {
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len: [3,30]
      }
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
      allowNull:false
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
  }, {
    indexes:[{
      unique: true,
      fields: ['mac', 'name', 'ip']
    }]
  },{timestamps: false, tableName: 'device'});

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

      deleteUser('SEL_12_12');


    insertDevice(device,(res)=>{

    });
    callback(true);
  });
}

function deleteUser(nameId) {
  device_model.destroy({
    where: {
      name: nameId
    }
  });
}

function insertDevice(device, callback){
  device_model.create({ ip: device.ip, name: device.name, netmask: device.netmask,
  model: device.model, gateway: device.gateway, manufacturer: device.manufacturer,
  mac: device.mac, id: device.id, state: device.state, type:device.type})
  .then(() => device_model.findOrCreate({where: {id: device.id}}))
  .spread((result, created) => {
    let res={
      type: 'success',
      message: 'The device'+ result.name + ' was registered successfully',
      data: result.dataValues
    };
    callback(res);
  }).catch((err)=>{
    //console.log(err)
    let error={
      type:'error',
      error: err
    };
    callback(error);
  });
}

function getDevice(param, callback) {
  device_model.findById(param).then(device => {
    console.log(device)
    if(device!=null){
    //  delete user.dataValues.password;
      let successData={
        type:'success',
        data: device.dataValues
      };
      callback(successData);
    }else{
      console.log('sera q entro por aca')
      callback(device);
    }
  }).catch((err)=>{
    console.log(err)
    let error={
      type:'error',
      error: err
    };
    callback(error);
  })
}

module.exports={
  createModelDataBase:createModelDataBase,
  insertDevice:insertDevice
}

const Sequelize = require('sequelize');
const database='user_management';
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
var user_t=undefined;
var organization=undefined;
var document_type=undefined;
var user_type=undefined;

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

  user_t = sequelize.define('user_t', {
    email: {
      type:Sequelize.STRING,
      allowNull:false,
      validate:{
        isEmail:true
      },
      primaryKey:true
    },
    names: {
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len: [3,100]
      }
    },
    lastnames:{
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len: [3,100]
      }
    },
    document_u:{
      type: Sequelize.INTEGER,
      allowNull:false,
      validate:{
        isInt: true
      }
    },
    document_type:{
      type: Sequelize.INTEGER,
      allowNull:false,
      validate:{
        isInt: true
      }
    },
    rol:{
      type: Sequelize.INTEGER,
      allowNull:false,
      validate:{
        isInt: true
      }
    },
    company:{
      type: Sequelize.INTEGER,
      allowNull:false,
      validate:{
        isInt: true
      }
    },
    password:{
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        is:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/i
      }
    },
    country:{
      type: Sequelize.STRING,
      allowNull:true,
      validate:{
        len:[3,50]
      }
    },
    city:{
      type:Sequelize.STRING,
      allowNull:true,
      validate:{
        len:[3,50]
      }
    },
    description:{
      type:Sequelize.STRING,
      allowNull:true,
      validate:{
        len:[3,500]
      }
    },
    state: {
      type:Sequelize.BOOLEAN,
      allowNull:false
    }/*,
    photo: {
      type:Sequelize.BLOB,
      allowNull:true
    }*/
  },{timestamps: false, tableName: 'user_t'});

  organization=sequelize.define('organization', {
    address:{
      type:Sequelize.STRING,
      allowNull:false,
      validate:{
        len:[3,80]
      }
    },
    id: {
      type:Sequelize.INTEGER,
      allowNull:false,
      autoIncrement: true,
      primaryKey:true
    },
    name:{
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len:[3,100]
      }
    }
  },{timestamps: false, tableName: 'organization'});

  document_type=sequelize.define('document_type', {
    id:{
      type:Sequelize.INTEGER,
      allowNull:false,
      autoIncrement: true,
      primaryKey:true
    },
    name:{
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len:[3,50]
      }
    }
  },{timestamps: false, tableName: 'document_type'});

  user_type=sequelize.define('user_type', {
    id:{
      type:Sequelize.INTEGER,
      allowNull:false,
      autoIncrement: true,
      primaryKey:true
    },
    rol:{
      type: Sequelize.STRING,
      allowNull:false,
      validate:{
        len:[3,30]
      }
    }
  },{timestamps: false, tableName: 'user_type'});
  organization.hasMany(user_t, {foreignKey: 'company', sourceKey: 'id'});
  user_type.hasMany(user_t, {foreignKey: 'rol', sourceKey: 'id'});
  document_type.hasMany(user_t, {foreignKey: 'document_type', sourceKey: 'id'});

  sequelize.sync().then(()=>{
  /*  let user={
      email: 'nilton.velez@udea.edu.co',
      names:'nilton steveen',
      lastnames: 'velez garcia',
      document_u: 1017233591,
      document_type: 1,
      rol: 1,
      company: 2,
      password: 'Hesoyam22',
      state: true
    }

    let userParams={
      email: 'nilton.velez@udea.edu.co',
      password: 'Hesoyam232'
    };

    createUser(user,(res)=>{
        console.log(res);
    });*/
    callback(sequelize);
  });

  //sequelize.sync();

}

function createUser(userparams, callback) {
  user_t.create({ email: userparams.email, names: userparams.names, lastnames: userparams.lastnames,
  document_u: userparams.document_u, document_type: userparams.document_type, rol: userparams.rol,
  company: userparams.company, password: userparams.password, state: userparams.state, country:userparams.country,
  city: userparams.city, description: userparams.city/*, photo: userparams.photo*/})
  .then(() => user_t.findOrCreate({where: {email: userparams.email}}))
  .spread((user, created) => {
    /*console.log(user.get({
      plain: true
    }))
    console.log(created)*/
  //  delete user.dataValues.password;
    let res={
      type: 'success',
      message: user.email + ' was registered successfully',
      data: user.dataValues
    };
    callback(res);
  }).catch((err)=>{
    //console.log(err);
    let error;
    if(err.name==='SequelizeForeignKeyConstraintError'){
      error={
        type:'error',
        name: 'SequelizeForeignKeyConstraintError',
        message: 'insert or update in the table user_t violates the foreign key'
      };
    }else if(err.name==='SequelizeUniqueConstraintError'){
      error={
        type:'error',
        name: 'SequelizeUniqueConstraintError',
        message: 'duplicate key violates uniqueness restriction'
      };
    }else if(err.name==='SequelizeValidationError'){
      error={
        type:'error',
        name: 'SequelizeValidationError',
        message: 'some field entered does not have the correct format'
      };
    }else{
      callback(err);
    }
    callback(error);
  });
}

function deleteUser() {

}

function getUserByEmail(email, callback) {
  user_t.findById(email).then(user => {
    if(user!=null){
    //  delete user.dataValues.password;
      callback(user.dataValues);
    }else{
      callback(user);
    }
  }).catch((err)=>{
    callback(err);
  })
}

function listUsers(callback) {
  user_t.findAndCountAll({
  })
  .then(result => {
    let arrayResponse=[];

    result.rows.forEach((user, index) => {
      arrayResponse.push(user.dataValues);
    });
    callback(arrayResponse);
  });
}

function updateUser() {

}

function authenticateUser(userParams, callback){
  getUserByEmail(userParams.email,(res)=>{
    if(res.password===userParams.password){
      callback(true);
    }else{
      callback(false);
    }
  });
}

module.exports={
  sequelize:sequelize,
  createModelDataBase:createModelDataBase,
  createUser:createUser,
  listUsers:listUsers,
  getUserByEmail:getUserByEmail,
  authenticateUser:authenticateUser
};

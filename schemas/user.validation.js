var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const userSchema=require('./user.schema');

//userSchema.loginUserRegisteringDataSchema
//userSchema.loginUserCredentialsSchema

var userD={
  email: 'nilton.velez@udea.edu.co',
  names:'nilton steveen',
  lastnames: 'velez garcia',
  document_u: 1017233591,
  document_type: 1,
  rol: 1,
  company: 1,
  password: 'hesoyam22',
  state: true
};

/*console.log('mmmmmmmmmmmmmmmmmmmmmmmm')
var res=validateUserData(userSchema.loginUserRegisteringDataSchema, userD);
console.log(res);
console.log('mmmmmmmmmmmmmmmmmmmmmmmm')*/

function validateUserData(schema, data) {
  let isFormatCorrect=ajv.validate(schema, data);
  if(isFormatCorrect){
    return isFormatCorrect;
  }else{
    return ajv.errors;
  }
}

function validateUserCredentials(schema, data) {
  let isFormatCorrect=ajv.validate(schema, data);
  if(isFormatCorrect){
    return isFormatCorrect;
  }else{
    return ajv.errors;
  }
}

module.exports={
  validateUserCredentials:validateUserCredentials,
  validateUserData:validateUserData
};

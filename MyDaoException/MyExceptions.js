const { MoleculerError } = require("moleculer").Errors;

class DataBaseException extends MoleculerError {
	constructor(msg, data) {
		super(msg || `An error has ocurred with database server.`, 500, "DATABASE_ERROR", data);
	}
}

class ValidationException extends MoleculerError {
	constructor(msg, data) {
		super(msg || `some field entered has errors`, 422, "Validation_Error", data);
	}
}

class ForeignKeyException extends MoleculerError {
	constructor(msg, data) {
		super(msg || `Insert or update in any table violates a foreign key`, 422, "FOREIGNKEY_ERROR", data);
	}
}

class UniqueConstraintException extends MoleculerError {
	constructor(msg, data) {
		super(msg || `duplicate key violates uniqueness restriction`, 422, "CONSTRAINT_ERROR", data);
	}
}

class SchemaValidationException extends MoleculerError {
	constructor(msg, data) {
		super(msg || `Some data in the body was incorrectly entered`, 422, "SCHEMA_ERROR", data);
	}
}

class PasswordValidationException extends MoleculerError {
	constructor(msg, data) {
		super(msg || `Wrong password`, 422, "BCRYPT_ERROR", data);
	}
}

class AllowedRolException extends MoleculerError {
	constructor(msg, data) {
		super(msg || `The current user doesn't have permission for those action`, 422, "ROL_ERROR", data);
	}
}

function generateDataError(errorG, nameG){
	console.log('arreglando el error')
	console.log(errorG.data.detail)
	console.log('arreglando el error')
	if(errorG.data.detail){
		errorG.data=errorG.data.detail;
	}
	let error={
		error:{
			code:errorG.code,
			type:errorG.type,
			data:errorG.data,
			name: nameG
		}
	};
	return (error);
}

module.exports={
	validationException:ValidationException,
	foreignKeyException:ForeignKeyException,
	uniqueConstraintException: UniqueConstraintException,
	DataBaseException:DataBaseException,
	schemaValidationException:SchemaValidationException,
	passwordValidationException:PasswordValidationException,
	allowedRolException:AllowedRolException,
	generateDataError:generateDataError
}

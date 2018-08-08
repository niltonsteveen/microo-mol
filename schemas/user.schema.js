const loginUserCredentialsSchema = {
	title: "UserCredentials",
	type: "object",
	properties:{
		email:{
      type: "string",
			transform:['trim','toLowerCase'],
			minLength: 8,
			maxLength: 30,
			format: 'email'
		},
		password:{
			type: "string",
			regexp: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/",
			minLength: 8,
			maxLength: 30
		},
	},
	required: ['email','password']
}

const loginUserRegisteringDataSchema = {
	title: "UserData",
	type: "object",
	properties:{
		password:{
			type: "string",
			pattern: /^[a-zA-Z0-9]+$/,
			min: 8,
			max: 30
		},
		email: {
			type: "email"
		},
		names: {
			type: "string",
			min: 3,
			max: 100
		},
		lastnames: {
			type: "string",
			min: 3,
			max: 100
		},
		rol: {
      type: "number",
			min: 1,
			integer:true
		},
		company: {
      type: "number",
			min: 1,
			integer:true
		},
    document_u:{
      type: "number",
			min: 1,
			integer:true
    },
    document_type:{
      type: "number",
			min: 1,
			integer:true
    },
    country:{
      type: "string",
			min: 3,
			max: 50,
			optional:true
    },
    city:{
      type: "string",
			min: 3,
			max: 50,
			optional:true
    },
    description:{
      type: "string",
			min: 3,
			max: 500,
			optional:true
    },
    state:{
      type: "boolean"
    }
	},
	required: ['password','email','names','lastnames','rol','company','document_u','document_type','state']
}

/*
const loginUserRegisteringDataSchema = {
	title: "UserData",
	type: "object",
	properties:{
		password:{
			type: "string",
			regexp: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/",
			minLength: 8,
			maxLength: 30
		},
		email: {
			type: "string",
			transform:['trim','toLowerCase'],
			minLength: 8,
			maxLength: 30,
			format: 'email'
		},
		names: {
			type: "string",
			transform:['trim'],
			minLength: 3,
			maxLength: 100
		},
		lastnames: {
			type: "string",
			transform:['trim'],
			minLength: 3,
			maxLength: 100
		},
		rol: {
      type: "number",
			minimum: 1
		},
		company: {
      type: "number",
			minimum: 1
		},
    document_u:{
      type: "number",
			minimum: 1
    },
    document_type:{
      type: "number",
			minimum: 1
    },
    country:{
      type: "string",
			minLength: 3,
			maxLength: 50
    },
    city:{
      type: "string",
			minLength: 3,
			maxLength: 50
    },
    description:{
      type: "string",
			minLength: 3,
			maxLength: 500
    },
    state:{
      type: "boolean"
    }
	},
	required: ['password','email','names','lastnames','rol','company','document_u','document_type','state']
}*/

module.exports = {
		loginUserCredentialsSchema: loginUserCredentialsSchema,
		loginUserRegisteringDataSchema: loginUserRegisteringDataSchema
}

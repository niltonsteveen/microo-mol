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
}

module.exports = {
		loginUserCredentialsSchema: loginUserCredentialsSchema,
		loginUserRegisteringDataSchema: loginUserRegisteringDataSchema
}

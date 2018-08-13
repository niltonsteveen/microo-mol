const deviceRegisteringDataSchema={
  title: "device",
	type: "object",
	properties:{
		ip:{
      type: "string",
			maxLength: 15,
			format: "ipv4"
		},
    name:{
      type: "string",
			transform:['trim'],
			minLength: 3,
			maxLength: 20
    },
    netmask:{
      type: "string",
			maxLength: 15,
			format: "ipv4"
    },
    model:{
      type: "string",
			transform:['trim'],
			minLength: 3,
			maxLength: 20
    },
    gateway:{
      type: "string",
			maxLength: 15,
			format: "ipv4"
    },
    manufacturer:{
			type: "string",
			transform:['trim'],
			minLength: 3,
			maxLength: 25
		},
    mac:{
      type:'string',
      regexp: '/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i'
    },
    type:{
      type:'string',
      minLength:3,
      maxLength: 20
    },
    state:{
      type:'string',
      minLength:3,
      maxLength: 20,
      default:'PENDING',
			"enum":[
				'PENDING',
				'INSTALLED'
      ]
    }
	},
	required: ['ip','name','netmask','gateway','mac','state', 'type']
};

const deviceRegisteringDataSchemaArray={
  title: 'devices',
  type: 'array',
  minItems: 1,
  items: deviceRegisteringDataSchema,
  uniqueItemProperties: ['ip','name','mac']
};

module.exports={
  deviceRegisteringDataSchema:deviceRegisteringDataSchema,
  deviceRegisteringDataSchemaArray:deviceRegisteringDataSchemaArray
};

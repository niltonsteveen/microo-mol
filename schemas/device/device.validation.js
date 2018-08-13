//var Ajv = require('ajv');
//var ajv = new Ajv({allErrors: true, useDefaults: "shared"}); // options can be passed, e.g. {allErrors: true}
//var validatorBuilder = Ajv({allErrors: true, useDefaults: "shared"});

//require('ajv-keywords')(ajv,['transform', 'regexp', 'uniqueItemProperties']);

/*To validate data we will use AJV (Another Json Validator)
 * The fastest JSON Schema validator for Node.js and browser*/
var Ajv = require('ajv');

/* Instantiating validation service.

	- allErrors: check all rules collecting all errors. Default is to return after the first error.
	- useDefaults: Ajv will assign values from default keyword in the schemas of properties and items
				   (when it is the array of schemas) to the missing properties and items.
				   If you need to insert the default value in the data by reference pass the option useDefaults: "shared".
*/
var validatorBuilder = Ajv({allErrors: true, useDefaults: "shared"});

/* We will use ajv-keywords module (Custom JSON-Schema keywords for Ajv validator)
 *
 * specifically we will use the following custom keywords:
 *
 * TRANSFORM: This keyword allows a string to be modified before validation.
 * These keywords apply only to strings. If the data is not a string, the transform is skipped.
 *
 * uniqueItemProperties: The keyword allows to check that some properties in array items are unique.
 * This keyword applies only to arrays. If the data is not an array, the validation succeeds.
 *
 * REGEXP: This keyword allows to use regular expressions with flags in schemas
 * (the standard pattern keyword does not support flags). This keyword applies only to strings.
 * If the data is not a string, the validation succeeds.*/

require('ajv-keywords')(validatorBuilder,['transform', 'regexp', 'uniqueItemProperties']);
let deviceSchema = require('./device.schema');
/*
function validateDeviceData(schema, data) {
  let isFormatCorrect=ajv.validate(schema, data);
  if(isFormatCorrect){
    return isFormatCorrect;
  }else{
    return ajv.errors;
  }
}*/

module.exports={
  deviceDataValidator:validatorBuilder.compile(deviceSchema.deviceRegisteringDataSchema),
  devicesDataValidator:validatorBuilder.compile(deviceSchema.deviceRegisteringDataSchemaArray),
  //validateDeviceData:validateDeviceData
}

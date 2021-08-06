import Utils from '../../Utils';
import { REAL_TYPE } from '../../constants';

export const isValidValue = (value, type) => {
  if (type == null) {
    return false;
  }

  let validate;

  switch (type) {
    case REAL_TYPE.INT:
      validate = (el) => el !== '' && !Number.isNaN(Number(el)) && Number.isInteger(Number(el));
      break;

    case REAL_TYPE.FLOAT:
      validate = (el) => el !== '' && !Number.isNaN(Number(el));
      break;

    case REAL_TYPE.STR:
      validate = (el) => String(el);
      break;

    case REAL_TYPE.BOOL:
      validate = (el) => Boolean(el);
      break;

    case REAL_TYPE.FUNC:
      // const valid = await Utils.evalPythonMessage('netpyne_geppetto.validateFunction', [el]);
      validate = (el) => true;
      break;

    default:
      // .. handling of more types
      // list(float), dict, list(list(float)), func
      validate = (el) => false;
      break;
  }

  return validate(value);
};

export const getErrorText = (type) => {
  switch (type) {
    case REAL_TYPE.INT:
      return 'Only integer values are allowed';

    case REAL_TYPE.FLOAT:
      return 'Float or int values allowed';

    case REAL_TYPE.STR:
      return 'Only string values are allowed';

    case REAL_TYPE.BOOL:
      return 'Only bool values (true|false) are allowed';

    case REAL_TYPE.FUNC:
      return 'Not a valid function';

    default:
      // .. handling of more types
      // list(float), dict, list(list(float)), func
      return 'Unkown error, field type is not supported';
  }
};

export const validateListParameter = (parameter) => {
  let { values } = parameter;
  const { field } = parameter;

  const validValue = values.every((element) => isValidValue(element, field?.type));
  if (validValue) {
    values = values.map((el) => Utils.convertFieldValue(field, el));
  }

  return {
    ...parameter,
    values,
    error: !validValue,
    helperText: validValue ? '' : getErrorText(parameter.field.type),
  };
};

export const validateRangeParameter = (parameter, val, key) => {
  const validValue = isValidValue(val, parameter.field ? parameter.field.type : null);

  return {
    ...parameter,
    [`${key}Val`]: val,
    [key]: validValue ? Utils.convertFieldValue(parameter.field, val) : val,
    [`${key}error`]: !validValue,
    [`${key}helperText`]: validValue ? '' : getErrorText(parameter?.field?.type),
  };
};
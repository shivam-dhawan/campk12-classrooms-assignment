'use strict';
/**
 * Parses request query to generate a mongoose find query.
 */

const queryConstants = require('../constants').queryConstants;

function parseQuery(model, query) {

  let field, operator, fieldType, parent, findQuery = {};

  /** Get field type by parsing the model. 
      P.S. - Try consoling model's object
      
      * Some properties in object may not have any type.  -->  [Handled at #1]
   */
  function getFieldType(field) {
    let ref = model;
    let parent = ref;
    let fieldArray = field.split('.');
    let fieldsLen = fieldArray.length;

    for (let i = 0; i < fieldsLen; i++) {
      if (Object.keys(ref.schema.paths).includes(fieldArray[i])) {
        ref = ref.schema.paths[fieldArray[i]];
      }
      else {  // #1
        ref = ref.schema.paths[`${fieldArray[i]}.${fieldArray[i + 1]}`];
        i++;
      }
    }

    parent = fieldArray[fieldsLen - 1].instance || null;
    return [ref.instance, parent];
  }

  /** Check if operation is allowed on the field */
  function isValidOperation(operator) {
    return queryConstants.ALLOWED_QUERY_OPERATIONS[fieldType].includes(operator)
      || (parent == 'Array' && queryConstants.ALLOWED_QUERY_OPERATIONS[parent].includes(operator));
  }

  for (let key in query) {

    [field, operator] = key.split(':');
    [fieldType, parent] = getFieldType(field);

    // Convert comma seperated values to array
    if (['all', 'in', 'nin'].includes(operator)) {
      query[key] = query[key].split(',');
    }

    if (operator === undefined) {
      findQuery[field] = query[key];
    }
    else {
      operator = `$${operator}`;
      if (isValidOperation(operator)) {
        if (!findQuery.hasOwnProperty(field))
          findQuery[field] = {};

        if (operator == '$contains') {   // Handles substring matching
          findQuery[field] = { '$regex': query[key], '$options': 'i' };
        }
        else {
          findQuery[field][operator] = query[key];
        }
      }
    }
    delete query[key];

  }

  return findQuery;
}

module.exports = {
  parseQuery
}

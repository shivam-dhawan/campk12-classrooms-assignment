'use strict';

const { inherits, format } = require('util');
const errorCodes = {};

createClientError('BAD_REQUEST_DATA', '%s', 400);
createClientError('INVALID_INFO_TYPE', '\'%s\' is invalid information type.', 400);
createClientError('PAYLOAD_REQUIRED', 'JWT sign require a payload.', 400);

createClientError('INVALID_CREDS', 'One of your email or password is incorrect.', 401);
createClientError('INVALID_OTP', 'Your OTP is invalid/expired.', 401);
createClientError('UNAUTHORIZED', 'You\'re not authorized to go beyond this point.', 401);
createClientError('NOT_ALLOWED', '%s', 401);
createClientError('MISSING_TOKEN', 'You need to provide token in \'Authorization\' header.', 401);
createClientError('INVALID_TOKEN', 'Token you\'re passing is invalid.', 401);
createClientError('EXPIRED_TOKEN', 'Token you\'re passing is expired.', 401);

createClientError('FORBIDDEN', 'You don\'t have enough permission to access this resource.', 403);

createClientError('NOT_FOUND', '%s', 404);
createClientError('RESOURCE_NOT_FOUND', '%s not found', 404);


function createClientError(code, message, statusCode = 400, Base = Error) {
  if (!code) throw new Error('Backend error code must not be empty');
  if (!message) throw new Error('Backend error message must not be empty');

  code = code.toUpperCase();

  function ClientError(a, b, c) {
    Error.captureStackTrace(this, ClientError);
    this.name = 'BackendClientError';
    this.code = `ERR_${code}`;

    // more performant than spread (...) operator
    if (a && b && c) {
      this.message = format(message, a, b, c);
    } else if (a && b) {
      this.message = format(message, a, b);
    } else if (a) {
      this.message = format(message, a);
    } else {
      this.message = message;
    }

    this.message = `${this.message}`;
    this.statusCode = statusCode || undefined;
  }
  ClientError.prototype[Symbol.toStringTag] = 'Error';

  inherits(ClientError, Base);

  errorCodes[code] = ClientError;

  return errorCodes[code];
}

module.exports = { errorCodes, createClientError };

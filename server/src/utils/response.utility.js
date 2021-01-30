'use strict';


async function okResponse(request, reply, data, extra, ct) {
  let contentType = ct || 'application/json';
  let dataToSend = {};

  switch (ct) {
  case 'application/octet-stream':
    dataToSend = data;
    break;
  default:
    dataToSend = {
      statusCode: 200,
      data: data,
      ...extra
    };
  }

  return reply
    .code(200)
    .header('Content-Type', `${contentType}; charset=utf-8`)
    .send(dataToSend);
}

async function badRequestResponse(request, reply, error) {
  let message = error.message.error || error._message || error.message;

  if (!fastify.config.DEBUG) {
    delete error.stack;
    delete error.config;
  }
  return reply
    .code(400)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      statusCode: 400,
      error: error,
      message: message
    });
}

async function errorResponse(request, reply, error) {
  let message = error.message.error || error._message || error.message;
  let statusCode = error.statusCode || 500;

  if (!fastify.config.DEBUG) {
    delete error.stack;
    delete error.config;
  }

  return reply
    .code(statusCode)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      statusCode: statusCode,
      error: error,
      message: message
    });
}

/**
 * @param paginatedData  Object { Array(result), Integer(totalCount) }
 */
async function paginatedResponse(request, reply, paginatedData) {
  let { result, totalCount } = paginatedData;
  let prevUrl, nextUrl, url = request.hostname + request.raw.url;
  let query = request.query;
  let hasPage = query.page !== undefined;

  query.pageSize = Number(query.pageSize) || fastify.config.PAGE_SIZE;
  query.page = Number(query.page) || 0;

  let next = totalCount > (query.page * query.pageSize + result.length) ? query.page + 1 : null;
  let prev = (query.page >= 1) ? query.page - 1 : null;

  if (hasPage) {
    nextUrl = next === null ? null : url.replace(`page=${query.page}`, `page=${next}`);
    prevUrl = prev === null ? null : url.replace(`page=${query.page}`, `page=${prev}`);
  }
  else {
    nextUrl = next === null ? null : url + '&page=' + next;
    prevUrl = prev === null ? null : url + '&page=' + prev;
  }

  let paginationData = {
    count: result.length,
    nextUrl: nextUrl,
    totalCount,
    prevUrl: prevUrl
  }
  fastify.okResponse(request, reply, result, paginationData);
}

module.exports = {
  okResponse, badRequestResponse, errorResponse, paginatedResponse
};

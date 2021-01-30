'use strict';

'use strict';
const AWS = require('aws-sdk');

/**
 * @param files Array of objects(name, data, key, contentType)
 * @param bucketName
 * @summary Generate Pre Signed urls with PUT policy expirey set to 1 minute
 * @returns Object of urls with key as file.key and value as url
 */
const generatePreSignedUrls = async function (files) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_S3_REGION
  });

  // let urls = [];
  const urls = {};

  for (const file of files) {
    const fileName = file.name || file.key;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `raw/${Date.now()}-${fileName.split(' ').join('+')}`,
      Expires: 160
    };
    const url = await s3.getSignedUrl('putObject', uploadParams);
    urls[file.key] = {
      putUrl: url,
      getUrl: url.split('?')[0]
    };
  }
  return urls;
};

const sendEmail = async function ({
  to, subject, message, cc = [], bcc = [], from = process.env.EMAIL_FROM, replyTo = process.env.EMAIL_REPLYTO
}) {
  const ses = new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_SES_REGION
  });

  // TODO: SES can send to max of 50 addr.
  const params = {
    Destination: {
      BccAddresses: [].concat(bcc),
      CcAddresses: [].concat(cc),
      ToAddresses: [].concat(to)
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: message
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: from,
    ReplyToAddresses: [].concat(replyTo)
  };

  return await ses.sendEmail(params).promise();
};

const sendBulkEmail = async function ({
  payload, templateName, defaultTemplateData = {}, from = process.env.EMAIL_FROM, replyTo = process.env.EMAIL_REPLYTO
}) {
  const ses = new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_SES_REGION
  });

  const params = {
    Destinations: [],
    Template: templateName,
    Source: from,
    ReplyToAddresses: [].concat(replyTo),
    DefaultTemplateData: JSON.stringify(defaultTemplateData)
  };

  for (const item of payload)
    params.Destinations.push({
      Destination: {
        ToAddresses: [].concat(item.to)
      },
      ReplacementTemplateData: (item.templateData ? JSON.stringify(item.templateData) : '{}')
    });


  return await ses.sendBulkTemplatedEmail(params).promise();
};

const uploadFile = async function (file, fileName, directory = 'files') {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_S3_REGION
  });
  fileName = fileName.replace(' ', '_');
  const date = new Date();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${directory}/${date.getFullYear()}/` + `${date.getMonth() + 1}` + `/${date.getDate()}/${fileName}`,
    Body: file,
    ContentType: 'application/octet-stream',
    ContentDisposition: `attachment;filename=${fileName}`
  };
  const response = await s3.upload(params).promise();
  return response.Location;
};

const invokeLambda = async function (endpoint, functionName, version, payload) {
  const params = {
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(payload),
    Qualifier: version
  };

  try {
    const lambda = new AWS.Lambda({
      endpoint: endpoint,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_LAMBDA_REGION
    });
    let data = await lambda.invoke(params).promise();
    data = JSON.parse(data.Payload);
    if (data.statusCode !== 200) throw data.error;
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
  /*
   *data = {
   *  Payload: <Binary String>,
   *  StatusCode: 200
   *}
   */
};

const createTemplate = async function (templateName, subject, body, altText) {
  const ses = new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_SES_REGION
  });

  const data = await ses.createTemplate({
    Template: {
      TemplateName: templateName,
      HtmlPart: body,
      SubjectPart: subject,
      TextPart: altText
    }
  }).promise();

  return data;
};

const updateTemplate = async function (templateName, subject, body, altText) {
  const ses = new AWS.SES({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_SES_REGION
  });

  const data = await ses.updateTemplate({
    Template: {
      TemplateName: templateName,
      HtmlPart: body,
      SubjectPart: subject,
      TextPart: altText
    }
  }).promise();

  return data;
};

module.exports = {
  generatePreSignedUrls,
  sendEmail,
  sendBulkEmail,
  uploadFile,
  invokeLambda,
  createTemplate,
  updateTemplate
};

'use strict';

let serverUtility = require('./utils/server.utility.js');

let main = async () => {
  // initialize app 
  let utilities = await serverUtility.initializeApp();

  // register app routes
  utilities.fastify.register(require('./routes'), { prefix: 'v1' });

  // Bind port
  await utilities.startServer();
};

main();

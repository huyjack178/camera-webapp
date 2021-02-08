const fastify = require('fastify');
const path = require('path');
const server = fastify();
const multer = require('fastify-multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadFtpHandler = require('./handlers/uploadFTP');
const uploadCloudHandler = require('./handlers/uploadCloud');
const uploadLocalHandler = require('./handlers/uploadLocal');
const loginHandler = require('./handlers/login');
const serialNumber = require('serial-number');

server
  .register(multer.contentParser)
  .register(require('fastify-cors'), {
    origin: '*',
  })
  .register(require('fastify-static'), {
    root: path.join(__dirname, 'web'),
  });

server.register(require('./jwt-auth')).after(() => {
  server.post('/uploadCloud', { preValidation: [server.authenticate], preHandler: upload.single('file') }, uploadCloudHandler);
  server.post('/uploadFTP', { preValidation: [server.authenticate], preHandler: upload.single('file') }, uploadFtpHandler);
  server.post('/uploadLocal', { preValidation: [server.authenticate], preHandler: upload.single('file') }, uploadLocalHandler);

  server.get('/', function (req, res) {
    res.sendFile('index.html');
  });

  server.get('/login', function (req, res) {
    res.sendFile('index.html');
  });

  server.post('/login', (req, res) => loginHandler(req, res, server));
});

server.listen(3000, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);

  serialNumber(function (error, value) {
    if (error) {
      console.error(error);
    }

    console.log(value);
  });
});

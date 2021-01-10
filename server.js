const fastify = require('fastify');
const path = require('path');
const server = fastify();
const multer = require('fastify-multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const configs = require('./configs');
const uploadFtpHandler = require('./handlers/uploadFTP');
const uploadCloudHandler = require('./handlers/uploadCloud');
const uploadLocalHandler = require('./handlers/uploadLocal');
const loginHandler = require('./handlers/login');

server.register(multer.contentParser);

server.register(require('fastify-cors'), {
  origin: '*',
});

server.register(require('fastify-static'), {
  root: path.join(__dirname, 'client/dist'),
});

server.get('/', function (req, res) {
  res.sendFile('index.html');
});

server.post('/login,', loginHandler);

server.register(require('fastify-jwt'), {
  secret: configs.jwtSecret,
});

server.register((instance, opts, next) => {
  // authenticated routes
  instance.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }

    instance.post('/uploadCloud', { preHandler: upload.single('file') }, uploadCloudHandler);
    instance.post('/uploadFTP', { preHandler: upload.single('file') }, uploadFtpHandler);
    instance.post('/uploadLocal', { preHandler: upload.single('file') }, uploadLocalHandler);
  });
});

server.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});

const fastify = require('fastify');
const path = require('path');
const server = fastify();
const multer = require('fastify-multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadFTP = require('./uploadFTP');
const uploadCloud = require('./uploadCloud');
const uploadLocal = require('./uploadLocal');

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

server.post('/uploadCloud', { preHandler: upload.single('file') }, uploadCloud);
server.post('/uploadFTP', { preHandler: upload.single('file') }, uploadFTP);
server.post('/uploadLocal', { preHandler: upload.single('file') }, uploadLocal);

server.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});

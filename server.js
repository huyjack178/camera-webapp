const fastify = require("fastify");
const path = require("path");
const server = fastify();
const multer = require("fastify-multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mime = require("mime-types");
const { uploadToCloud, uploadToFTP } = require("./upload");

server.register(multer.contentParser);

server.register(require("fastify-cors"), {
  origin: "*",
});

server.register(require("fastify-static"), {
  root: path.join(__dirname, "client/dist"),
});

server.get("/", function (req, res) {
  res.sendFile("index.html");
});

server.post(
  "/upload",
  { preHandler: upload.single("file") },
  async (req, res) => {
    const file = req.file;
    console.log(file);
    const fileName = file.originalname + "." + mime.extension(file.mimetype);
    uploadToFTP(file.buffer, fileName, (err) => {
      let responseCloud;
      let responseFtp;

      if (err) {
        responseFtp = { error: err, success: false };
      } else {
        responseFtp = { success: true };
      }

      uploadToCloud(file.buffer, fileName, (err, uploadResponse) => {
        if (err) {
          responseCloud = { error: err, success: false };
        } else {
          responseCloud = {
            success: true,
            url: uploadResponse.url,
          };
        }

        res.code(200).send({
          ftp: responseFtp,
          cloud: responseCloud,
        });
      });
    });
  }
);

server.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});

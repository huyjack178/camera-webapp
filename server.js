const fastify = require("fastify");
const path = require("path");
const multer = require("fastify-multer");
const configs = require("./configs");
const cloudinary = require("cloudinary").v2;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const server = fastify();

cloudinary.config({
  cloud_name: configs.cloudinary.cloud_name,
  api_key: configs.cloudinary.api_key,
  api_secret: configs.cloudinary.api_secret,
});

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

const uploadFiles = async (req, res) => {
  req.files.forEach((file) => {
    console.log(file);
    uploadToCloud(file.buffer);
  });
};

const uploadToCloud = async (fileContent) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      {
        discard_original_filename: false,
        use_filename: true,
        transformation: { quality: "auto:low" },
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Upload succeed: ${res.url}`);
        }
      }
    );

    stream.end(fileContent);
  } catch (error) {
    console.log(error);
  }
};

server.post("/upload", { preHandler: upload.array("file") }, uploadFiles);

server.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});

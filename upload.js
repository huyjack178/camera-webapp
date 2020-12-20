const configs = require("./configs");
const cloudinary = require("cloudinary").v2;
const Ftp = require("ftp");
cloudinary.config(configs.cloudinary);

const uploadToCloud = async (fileContent, fileName, callback) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        use_filename: true,
        transformation: { quality: "auto:low" },
      },
      (err, res) => {
        callback(err, res);
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

const uploadToFTP = async (fileContent, fileName, callback) => {
  const ftpClient = new Ftp();
  ftpClient.connect(configs.ftp);

  ftpClient.on("ready", function () {
    ftpClient.put(fileContent, fileName, function (err, list) {
      if (err) {
        console.log(err);
      }

      console.log("Upload FTP success");
      ftpClient.end();
      callback(err);
    });
  });
};

module.exports = {
  uploadToCloud,
  uploadToFTP,
};

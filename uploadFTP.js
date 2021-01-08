const configs = require("./configs");
const Ftp = require("ftp");
const mime = require("mime-types");

const uploadFTP = async (req, res) => {
  const file = req.file;
  console.log(file);
  const fileName = file.originalname + "." + mime.extension(file.mimetype);
  uploadToFTP(file.buffer, fileName, (err) => {
    let response;

    if (err) {
      response = { error: err, success: false };
    } else {
      response = { success: true };
    }
    
    res.code(200).send({
      ftp: response,
    });
  });
}

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

module.exports = uploadFTP;

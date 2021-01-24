const configs = require('../configs');
const Ftp = require('ftp');
const mime = require('mime-types');

const uploadFTP = async (req, res) => {
  console.log('Uploading FTP ... ');
  const file = req.file;
  const fileName = file.originalname + '.' + mime.extension(file.mimetype);
  // const ftpSetting = JSON.parse(req.body.ftpSetting);

  uploadToFTP(file.buffer, fileName, (err) => {
    let response;

    if (err) {
      response = { error: err, success: false };
    } else {
      response = { success: true, host: configs.ftp.host };
    }

    res.code(200).send({
      ftp: response,
    });
  });
};

const uploadToFTP = async (fileContent, fileName, callback) => {
  const ftpClient = new Ftp();
  try {
    ftpClient.connect(configs.ftp);

    ftpClient.on('ready', function () {
      ftpClient.put(fileContent, fileName, function (err, list) {
        if (err) {
          console.log(err);
        }

        console.log('Upload FTP success');
        ftpClient.end();
        callback(err);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = uploadFTP;

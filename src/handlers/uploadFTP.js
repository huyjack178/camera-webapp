const configs = require('../configs');
const ftp = require('basic-ftp');
const mime = require('mime-types');
const { Readable } = require('stream');

const uploadFTP = async (req, res) => {
  console.log('Uploading FTP ... ');
  const file = req.file;
  const fileName = file.originalname + '.jpg';

  uploadToFTP(bufferToStream(file.buffer), fileName, (err) => {
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
  const ftpClient = new ftp.Client();

  try {
    await ftpClient.access(configs.ftp);
    await ftpClient.uploadFrom(fileContent, configs.ftp.rootFolder + fileName);
  } catch (err) {
    callback(err);
    console.log(err);
  }
  console.log('Uploading FTP Success ');
  callback('');
  ftpClient.close();
};

const bufferToStream = (binary) => {
  return new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });
};

module.exports = uploadFTP;

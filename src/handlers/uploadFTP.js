const configs = require('../configs');
const ftp = require('basic-ftp');
const { Readable } = require('stream');
const moment = require('moment');

const uploadFTP = async (req, res) => {
  console.log('Uploading FTP ... ');
  const file = req.file;
  const fileName = file.originalname + '.jpg';

  uploadToFTP(bufferToStream(file.buffer), fileName, req, (err) => {
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

const uploadToFTP = async (fileContent, fileName, req, callback) => {
  const ftpClient = new ftp.Client();

  try {
    await ftpClient.access(configs.ftp);
    const date = req.body.fileDate;
    const folderPath = `${moment(date).format('YYYY')}/${moment(date).format('MM')}/${moment(date).format('YYYYMMDD')}/${req.body.userName}/${req.body.fileId}/`;
    await ftpClient.ensureDir(configs.ftp.rootFolder + folderPath);
    await ftpClient.uploadFrom(fileContent, configs.ftp.rootFolder + folderPath + fileName);
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

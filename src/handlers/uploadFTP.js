const configs = require('../configs');
const ftp = require('basic-ftp');
const { Readable } = require('stream');
const moment = require('moment');

const uploadFTP = async (req, res) => {
  console.log('Uploading FTP ... ');
  const file = req.file;
  const fileName = file.originalname + '.jpg';

  uploadToFTP(bufferToStream(file.buffer), fileName, req, (result) => {
    let response;

    if (result.error) {
      response = { error: result.error, success: false };
    } else {
      response = { success: true, host: configs.ftp.host, folderPath: result.folderPath };
    }

    res.code(200).send({
      ftp: response,
    });
  });
};

const uploadToFTP = async (fileContent, fileName, req, onFinishedUpload) => {
  const ftpClient = new ftp.Client();
  let folderPath;

  try {
    await ftpClient.access(configs.ftp);
    const date = req.body.fileDate;
    folderPath = `/${moment(date).format('YYYY')}/${moment(date).format('MM')}/${moment(date).format('YYYYMMDD')}/${req.body.userName.toUpperCase()}/${req.body.fileId}/`;
    await ftpClient.ensureDir(configs.ftp.rootFolder + folderPath);
    await ftpClient.uploadFrom(fileContent, configs.ftp.rootFolder + folderPath + fileName);
  } catch (err) {
    onFinishedUpload({ error: err });
    console.log(err);
    return;
  }

  ftpClient.close();
  onFinishedUpload({ folderPath: configs.ftp.rootFolder + folderPath });
  console.log('Uploading FTP Success ' + configs.ftp.rootFolder + folderPath);
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

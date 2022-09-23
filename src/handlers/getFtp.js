const ftp = require('basic-ftp');
const configs = require('../configs');
const moment = require('moment/moment');
const fs = require('fs');
const { Readable } = require('stream')

const getFtpFolderPath = async (req, res) => {
  const date = req.body.fileDate;
  const fileId = req.body.fileId;
  const userName = req.body.userName;
  const folderPath = `${configs.ftp.rootFolder}/${moment(date).format('YYYY')}/${moment(date).format('MM')}/${moment(date).format('YYYYMMDD')}/${userName.toUpperCase()}/${fileId}/`;
  console.log(folderPath)
  res.code(200).send(folderPath);
};

const getImagesFromFtp = async (req, res) => {
  const folderPath = req.body.folderPath;
  console.log(folderPath);
  const ftpClient = new ftp.Client();

  try {
    await ftpClient.access(configs.ftp);
    const fileInfos = await ftpClient.list(folderPath);
    res.code(200).send(fileInfos.map(file => file.name));
    console.log('Get FTP Success ');
    ftpClient.close();
  } catch (err) {
    res.code(500).send({
      err,
    });
    console.log(err);
  }
}

const downloadFile = async (req, res) => {
  const filePath = req.body.filePath;
  const client = new ftp.Client();
  const tempFile = 'temp.jpg'
  try {
    console.log(filePath)

    await client.access(configs.ftp);
    await client.downloadTo(tempFile, filePath);
    const buffer = fs.readFileSync(tempFile) // sync just for DEMO
    const myStream = new Readable({
      read () {
        this.push(buffer)
        this.push(null)
      }
    })

    res.send('data:image/jpeg;base64,'  + buffer.toString('base64'))
  }
  catch(err) {
    console.log(err)
    res.code(500).send({
      err,
    });
  }
  client.close()
}


module.exports = { getImagesFromFtp, getFtpFolderPath, downloadFile };
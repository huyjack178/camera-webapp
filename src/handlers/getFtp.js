const ftp = require('basic-ftp');
const configs = require('../configs');

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

module.exports = getImagesFromFtp;
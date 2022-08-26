const ftp = require('basic-ftp');
const configs = require('../configs');

const getImagesFromFtp = async (req, res) => {
  const folderPath = req.body.folderPath;
  console.log(folderPath);
  const ftpClient = new ftp.Client();

  try {
    await ftpClient.access(configs.ftp);
    const fileInfos = await ftpClient.list(folderPath);
    for (const file in fileInfos) {
      let writeStream = fs.createWriteStream(file.name);

      await ftpClient.downloadTo(writeStream, folderPath + file.name);
      console.log(writeStream);
    }

  } catch (err) {
    res.code(500).send({
      err,
    });
    console.log(err);
  }
  console.log('Get FTP Success ');
  ftpClient.close();

  res.code(200).send({});
  console.log(err);
};

module.exports = getImagesFromFtp;
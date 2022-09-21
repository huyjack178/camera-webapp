const configs = require('../configs');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const address = require('address');

const uploadLocal = async (req, res) => {
  console.log('Uploading LOCAL ... ');
  const file = req.file;
  const date = req.body.fileDate;
  const fileName = file.originalname + '.jpg';
  let rootFolderPath;

  if (req.body.isHighResolution === 'true') {
    rootFolderPath = `${configs.uploadDirectoryPath.high}/${moment(date).format('YYYY')}`;
  } else {
    rootFolderPath = `${configs.uploadDirectoryPath.low}/${moment(date).format('YYYY')}_GIAM`;
  }

  const folderPath = `${rootFolderPath}/${moment(date).format('MM')}/${moment(date).format('YYYYMMDD')}/${req.body.userName.toUpperCase()}/${req.body.fileId}`;
  const photoFolderPath = mkDirByPathSync(folderPath);

  uploadToLocal(file.buffer, fileName, photoFolderPath, (err) => {
    let response;

    if (err) {
      response = { error: err, success: false };
    } else {
      response = { success: true, path: `${address.ip()}\\\\${photoFolderPath}` };
    }

    res.code(200).send({
      local: response,
    });
  });
};

const uploadToLocal = async (fileContent, fileName, photoFolderPath, callback) => {
  try {
    fs.writeFileSync(`${photoFolderPath}/${fileName}`, fileContent);
  } catch (err) {
    console.log(err);
    callback(err);
  }

  callback();
};

const mkDirByPathSync = (targetDir, { isRelativeToScript = false } = {}) => {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    console.log(curDir)
    try {
      fs.mkdirSync(curDir, { recursive: true });
    } catch (err) {
      if (err.code === 'EEXIST') {
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
};

module.exports = uploadLocal;

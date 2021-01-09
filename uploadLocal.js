const configs = require('./configs');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
var ip = require('ip');

const uploadLocal = async (req, res) => {
  const file = req.file;
  const date = req.body.fileDate;
  console.log(file);
  const fileName = file.originalname + '.' + mime.extension(file.mimetype);
  const folderPath = `${configs.uploadDirectoryPath}/${moment(date).format('YYYY')}/${moment(date).format('YYYYMMDD')}`;
  const photoFolderPath = mkDirByPathSync(folderPath);

  uploadToLocal(file.buffer, fileName, photoFolderPath, (err) => {
    let response;

    if (err) {
      response = { error: err, success: false };
    } else {
      response = { success: true, path: `${ip.address()}\\\\${photoFolderPath}` };
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

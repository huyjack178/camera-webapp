const configs = require("./configs");
const mime = require("mime-types");
const fs = require("fs");
const moment = require("moment");
const uploadDir = './uploadFiles';

const uploadLocal = async (req, res) => {
  const file = req.file;
  const date = req.date;
  console.log(file);
  const fileName = file.originalname + "." + mime.extension(file.mimetype);
  uploadToLocal(file.buffer, fileName, date, (err) => {
    let response;

    if (err) {
      response = { error: err, success: false };
    } else {
      response = { success: true };
    }
    
    res.code(200).send({
      local: response,
    });
  });
}

const uploadToLocal = async (fileContent, fileName, date, callback) => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
  
    const photoDir = `${moment(date).format("YYYY")}/${moment(date).format("YYYYMMDD")}`;
    if (!fs.existsSync(photoDir)) {
      fs.mkdirSync(photoDir);
    }
  
    fs.writeFileSync(`${uploadDir}/${photoDir}/${fileName}`, fileContent);
  }
  catch (err) {
    console.log(err);
    callback(err);
  }
};

module.exports = uploadLocal;

const configs = require('./configs');
const cloudinary = require('cloudinary').v2;
const mime = require('mime-types');

const uploadCloud = async (req, res) => {
  const file = req.file;
  const fileName = file.originalname + '.' + mime.extension(file.mimetype);
  const cloudinarySetting = JSON.parse(req.body.cloudinarySetting);

  uploadToCloud(file.buffer, fileName, cloudinarySetting, (err, uploadResponse) => {
    let response;
    if (err) {
      response = { error: err, success: false };
    } else {
      response = {
        success: true,
        url: uploadResponse.url,
      };
    }

    res.code(200).send({
      cloud: response,
    });
  });
};

const uploadToCloud = async (fileContent, fileName, cloudinarySetting, callback) => {
  cloudinary.config(cloudinarySetting.cloud_name ? cloudinarySetting : configs.cloudinary);

  try {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        use_filename: true,
        transformation: { quality: 'auto:low' },
      },
      (err, res) => {
        callback(err, res);
        if (err) {
          console.log(err);
        } else {
          console.log(`Upload succeed: ${res.url}`);
        }
      }
    );

    stream.end(fileContent);
  } catch (error) {
    console.log(error);
  }
};

module.exports = uploadCloud;

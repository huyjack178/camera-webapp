const configs = require('../configs');
const address = require('address');
const serialNumber = require('serial-number');

const login = async (req, res, server) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const serialNumbers = JSON.parse(req.body.serialNumbers);
  const expiredDateText = req.body.expiredDate;

  serialNumber(function (err, serial) {
    if (!serialNumbers || !serialNumbers.includes(serial)) {
      res.code(400).send('Thông tin server serial number chưa đúng');
    }

    if (expiredDateText) {
      const expiredDate = new Date(expiredDateText);

      if (expiredDate < new Date()) {
        res.code(400).send('License của bạn bị hết hạn');
      }
    } else {
      res.code(400).send('License của bạn bị hết hạn');
    }

    if (!userName || !password) {
      res.code(400).send('Username hoặc password không hợp lệ');
    }

    const currentUser = configs.users.find((user) => user.userName.toUpperCase() === userName.toUpperCase());

    if (currentUser && currentUser.password === password) {
      const token = server.jwt.sign({ payload: req.query.payload });
      res.code(200).send({
        token,
        imageMaxSizes: JSON.stringify(configs.imageMaxSizes),
        settings: JSON.stringify({
          ftp: { enabled: !!configs.ftp.host },
          cloudinary: { enabled: !!configs.cloudinary.cloud_name },
          local: { enabledLow: !!configs.uploadDirectoryPath.low, enabledHigh: !!configs.uploadDirectoryPath.high },
        }),
      });
    } else {
      res.code(400).send('Username hoặc password chưa đúng');
    }
  });
};

module.exports = login;

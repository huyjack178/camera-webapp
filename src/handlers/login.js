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
      res.code(400).send('Server Id is not correct');
    }

    if (expiredDateText) {
      const expiredDate = new Date(expiredDateText);

      if (expiredDate < new Date()) {
        res.code(400).send('Your license is expired');
      }
    } else {
      res.code(400).send('Your license is expired');
    }

    if (!userName || !password) {
      res.code(400).send('Username or password is not empty');
    }

    const currentUser = configs.users.find((user) => user.userName.toUpperCase() === userName.toUpperCase());

    if (currentUser && currentUser.password === password) {
      const token = server.jwt.sign({ payload: req.query.payload });
      res.code(200).send({
        token,
        imageMaxSizes: JSON.stringify(configs.imageMaxSizes),
        settings: JSON.stringify({ ftp: { enabled: !!configs.ftp.host }, cloudinary: { enabled: !!configs.cloudinary.cloud_name } }),
      });
    } else {
      res.code(400).send('Username or password is not correct');
    }
  });
};

module.exports = login;

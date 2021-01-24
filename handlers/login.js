const configs = require('../configs');
const address = require('address');

const login = async (req, res, server) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const serverAddress = JSON.parse(req.body.serverAddress);
  const expiredDateText = req.body.expiredDate;

  address.mac((err, addr) => {
    const currentServerAdrress = addr.toUpperCase().replace(/:/g, '-');

    if (!serverAddress || !serverAddress.includes(currentServerAdrress)) {
      res.code(400).send('Server MAC address is not correct');
    }

    if (expiredDateText) {
      const expiredDate = new Date(expiredDateText);
      console.log(expiredDate);
      console.log(new Date());
      if (expiredDate < new Date()) {
        res.code(400).send('Your license is expired');
      }
    } else {
      res.code(400).send('Your license is expired');
    }

    if (!userName || !password) {
      res.code(400).send('Username or password is not empty');
    }

    if (userName == configs.adminUser.userName && password == configs.adminUser.password) {
      const token = server.jwt.sign({ payload: req.query.payload });
      res.code(200).send({ token, imageMaxSize: configs.imageMaxSize });
    } else {
      res.code(400).send('Username or password is not correct');
    }
  });
};

module.exports = login;

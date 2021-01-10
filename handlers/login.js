const fastify = require('fastify');
const configs = require('../configs');
const server = fastify();

const login = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    res.code(400).send();
  }

  if (userName == configs.adminUser.userName && password == configs.adminUser.password) {
    const token = server.jwt.sign({ payload: req.query.payload });
    res.send({ token });
  }
};

module.exports = login;

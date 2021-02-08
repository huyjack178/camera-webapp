module.exports = {
  serverUrl: process.env.NODE_ENV === 'production' ? 'http://$IP:3000' : 'http://127.0.0.1:3000',
  expiredDate: '$EXPIRED_DATE',
  serialNumbers: ['$SERIAL_ID'],
};

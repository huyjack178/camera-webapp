module.exports = {
  jwtSecret: 'thisissecretjwt',
  imageMaxSizes: {
    high: 2100,
    low: 840,
  },
  uploadDirectoryPath: {
    low: './low',
    high: './high',
  },
  users: [
    {
      userName: 'KC',
      password: 'KC1234aaAA',
    },
    {
      userName: 'VS',
      password: 'VS1234aaAA',
    },
    {
      userName: 'SC',
      password: 'VS1234aaAA',
    },
    {
      userName: 'GD',
      password: 'VS1234aaAA',
    },
    {
      userName: 'VP',
      password: 'VS1234aaAA',
    },
    {
      userName: 'admin',
      password: '1234aaAA',
    },
  ],
  cloudinary: {
    cloud_name: 'harrison178',
    api_key: '249396988716972',
    api_secret: '2gfT6Uar6u8in8Wky2a3D_6pC6s',
  },
  ftp: {
    host: 'ftp.dlptest.com',
    port: '21',
    user: 'dlpuser',
    rootFolder: '/',
    password: 'rNrKYTX9g7z3RgJRmxWuGHbeu',
  },
  // cloudinary: {
  //   cloud_name: '',
  //   api_key: '',
  //   api_secret: '',
  // },
  // ftp: {
  //   host: '',
  //   user: '',
  //   password: '',
  // },
};

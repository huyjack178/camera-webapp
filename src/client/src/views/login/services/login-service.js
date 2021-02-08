import axios from 'axios';
import configs from '../../../configs';

export default class LoginService {
  login = (userName, password, callback) => {
    axios
      .post(`${configs.serverUrl}/login`, {
        userName: userName.toLowerCase(),
        password: password,
        serialNumbers: JSON.stringify(configs.serialNumbers),
        expiredDate: configs.expiredDate,
      })
      .then(response => {
        callback(response);
      })
      .catch(error => {
        if (error.response) {
          callback(error.response);
        }
      });
  };
}

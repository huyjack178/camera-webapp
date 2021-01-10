import axios from 'axios';
import configs from '../configs';

export default class LoginService {
  login = (userName, password, callback) => {
    axios
      .post(`${configs.serverUrl}/login`, { userName, password, serverMACs: JSON.stringify(configs.serverMACs) })
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

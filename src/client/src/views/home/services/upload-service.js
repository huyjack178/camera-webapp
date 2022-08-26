import axios from 'axios';
import FormData from 'form-data';
import configs from '../../../configs';

export default class UploadService {
  constructor() {
    this.commonUploadService = new CommonUploadService();
  }

  uploadLocalServer = ({ file, fileId, fileName, fileDate, userName, isHighResolution }, callback) => {
    const data = this.commonUploadService.initFormData(file, fileId, fileName, fileDate, userName, isHighResolution);
    this.commonUploadService.upload('/uploadLocal', data, callback);
  };

  uploadFTP = ({ file, fileId, fileName, fileDate, userName }, callback) => {
    const data = this.commonUploadService.initFormData(file, fileId, fileName, fileDate, userName);

    this.commonUploadService.upload('/uploadFTP', data, callback);
  };

  uploadCloud = ({ file, fileId, fileName }, callback) => {
    const data = this.commonUploadService.initFormData(file, fileId, fileName);

    this.commonUploadService.upload('/uploadCloud', data, callback);
  };

  listFtpUploadFileNames = (folderPath, callback) => {
    this.commonUploadService.post('/ftpImages', { folderPath }, callback);
  }
}

class CommonUploadService {
  initFormData = (file, fileId, fileName, fileDate = null, userName = '', isHighResolution = false) => {
    let data = new FormData();
    data.append('file', file, fileName);
    data.append('fileId', fileId);

    if (fileDate) {
      data.append('fileDate', fileDate.toISOString());
    }

    if (userName) {
      data.append('userName', userName.toUpperCase());
    }

    data.append('isHighResolution', isHighResolution);

    return data;
  };

  upload = (path, data, callback) => {
    const serverUrl = configs.serverUrl;
    const token = window.$cookies.get('token');
    axios
      .post(serverUrl + path, data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data`,
          Authorization: 'Bearer ' + token,
        },
      })
      .then(response => callback(response))
      .catch(error => {
        if (error.response) {
          callback(error.response);
        }
      });
  };

  post = (path, data, callback) => {
    const serverUrl = configs.serverUrl;
    const token = window.$cookies.get('token');
    axios
      .post(serverUrl + path, data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          Authorization: 'Bearer ' + token,
        },
      })
      .then(response => callback(response))
      .catch(error => {
        if (error.response) {
          callback(error.response);
        }
      });
  }
}

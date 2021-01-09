import axios from 'axios';
import FormData from 'form-data';
import configs from '../configs';

export default class UploadService {
  constructor() {
    this.commonUploadService = new CommonUploadService();
  }

  uploadLocalServer = (file, fileName, fileDate, serverIp, callback) => {
    const data = this.commonUploadService.initFormData(file, fileName, fileDate);
    this.commonUploadService.upload('/uploadLocal', data, callback, serverIp);
  };

  uploadFTP = (file, fileName, ftpSetting, callback) => {
    const data = this.commonUploadService.initFormData(file, fileName);
    data.append('ftpSetting', JSON.stringify(ftpSetting));

    this.commonUploadService.upload('/uploadFTP', data, callback);
  };

  uploadCloud = (file, fileName, cloudinarySetting, callback) => {
    const data = this.commonUploadService.initFormData(file, fileName);
    data.append('cloudinarySetting', JSON.stringify(cloudinarySetting));

    this.commonUploadService.upload('/uploadCloud', data, callback);
  };
}

class CommonUploadService {
  initFormData = (file, fileName, fileDate = null) => {
    let data = new FormData();
    data.append('file', file, fileName);

    if (fileDate) {
      data.append('fileDate', fileDate.toISOString());
    }

    return data;
  };

  upload = (path, data, callback, serverIp) => {
    const serverUrl = serverIp ? `http://${serverIp}:3000` : configs.serverUrl;
    axios
      .post(serverUrl + path, data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data`,
        },
      })
      .then(response => callback(response));
  };
}

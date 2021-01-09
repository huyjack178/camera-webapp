import axios from "axios";
import FormData from "form-data";
import configs from "../configs";

export default class UploadService {
  constructor() {
    this.commonUploadService = new CommonUploadService();
  }

  uploadLocalServer = (file, fileName, fileDate, callback) => {
    const data = this.commonUploadService.initFormData(
      file,
      fileName,
      fileDate
    );
    this.commonUploadService.upload("/uploadLocal", data, callback);
  };

  uploadFTP = (file, fileName, callback) => {
    const data = this.commonUploadService.initFormData(file, fileName);
    this.commonUploadService.upload("/uploadFTP", data, callback);
  };

  uploadCloud = (file, fileName) => {
    const data = this.commonUploadService.initFormData(file, fileName);
    this.commonUploadService.upload("/uploadCloud", data);
  };
}

class CommonUploadService {
  initFormData = (file, fileName, fileDate = null) => {
    let data = new FormData();
    data.append("file", file, fileName);

    if (fileDate) {
      data.append("fileDate", fileDate.toISOString());
    }

    return data;
  };

  upload = (url, data, callback) => {
    axios
      .post(configs.serverUrl + url, data, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data`,
        },
      })
      .then((response) => callback(response));
  };
}

import watermark from 'watermarkjs';

export default {
  processImage(imageFile, imageMaxSizes, callback) {
    watermark([imageFile])
      .image(watermark.text.lowerRight('watermark.js', '20vw Josefin Slab', '#000', 1))
      .then(imageElement => {
        const lowImageFile = this.resizeImage(imageElement, imageMaxSizes.low);
        const highImageFile = this.resizeImage(imageElement, imageMaxSizes.high);

        callback(imageElement, { lowImageFile, highImageFile });
      });

    // const reader = new FileReader();
    // reader.onload = async readerEvent => {
    //   const imageElement = new Image();

    //   imageElement.onload = () => {
    //     this.resizeImage(imageElement, imageMaxSizes.low).then(lowImageFile => {
    //       this.resizeImage(imageElement, imageMaxSizes.high).then(highImageFile => {
    //         callback(imageElement, { lowImageFile, highImageFile });
    //       });
    //     });
    //   };

    //   imageElement.src = readerEvent.target.result;
    // };

    // reader.readAsDataURL(imageFile);
  },

  resizeImage(imageElement, maxSize) {
    const canvas = document.createElement('canvas');
    let width = imageElement.width;
    let height = imageElement.height;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(imageElement, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    const resizedImage = this.dataURLToBlob(dataUrl);

    return resizedImage;
  },

  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';

    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = parts[1];

      return new Blob([raw], { type: contentType });
    }

    parts = dataURL.split(BASE64_MARKER);
    contentType = parts[0].split(':')[1];
    raw = window.atob(parts[1]);
    const rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  },
};

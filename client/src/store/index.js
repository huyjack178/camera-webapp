const store = {
    state: {
      photoFiles: []
    },
    
    addPhoto: function (photoFile) {
      this.state.photoFiles.push(photoFile)
    },

    clearPhotos: function () {
      this.state.photoFiles = [];
    }
  }

export default store;
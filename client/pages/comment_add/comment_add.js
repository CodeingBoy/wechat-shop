const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    product: {},
    images: []
  },
  onLoad: function(options) {
    const productId = options.id;
    this.loadProductData(productId);
  },
  loadProductData: function(productId) {
    const page = this;
    qcloud.request({
      url: config.service.productDetail + productId,
      success: function(response) {
        const productInfo = response.data.data;
        page.setData({
          product: productInfo
        });
      },
      fail: function() {
        wx.showToast({
          title: 'Load product failed',
          icon: 'none'
        });
        wx.navigateBack();
      }
    });
  },
  onSubmit: function(event) {
    wx.showLoading({
      title: 'Submmitting'
    });

    const formDetails = event.detail.value;
    const content = formDetails.content;

    if (!content) {
      wx.hideLoading();
      wx.showModal({
        title: 'Comment is empty',
        content: 'Comment can not be null'
      });
      return;
    }

    const page = this;

    this.uploadImages(function(completeCount, succeedCount, uploadedImages) {
      if (succeedCount !== completeCount) {
        wx.showToast({
          title: 'Upload image failed, please try again later',
          icon: 'none'
        });
        return;
      }

      const onComplete = function() {
        wx.hideLoading();
      };

      qcloud.request({
        url: config.service.addComment,
        login: true,
        method: 'POST',
        data: {
          productId: page.data.product.id,
          content: content,
          images: uploadedImages
        },
        success: function(response) {
          wx.navigateBack();

          wx.showToast({
            title: 'Success',
            icon: 'suceess'
          });

          onComplete();
        },
        fail: function(error) {
          wx.showToast({
            title: 'Submit failed, please try again later',
            icon: 'none'
          });
          console.log(error);

          onComplete();
        }
      });
    });
  },
  onTapChooseImage: function(event) {
    const page = this;
    wx.chooseImage({
      count: 3,
      success: function(res) {
        var images = page.data.images;
        const chosenImageCount = res.tempFilePaths.length;

        for (let i = 0; i < chosenImageCount; i++) {
          images.push(res.tempFilePaths[i]);
        }
        if (images.length > 3) {
          images = images.slice(images.length - 3);
        }

        page.setData({
          images
        });
      },
    });
  },
  onTapImages: function(event) {
    const imagePath = event.currentTarget.dataset.imagePath;
    wx.previewImage({
      urls: this.data.images,
      current: imagePath
    });
  },
  uploadImages: function(onComplete) {
    const images = this.data.images;
    const imageCount = images.length;
    var completedCount = 0,
      succeedCount = 0;

    var uploadedImages = new Array(imageCount);
    for (let i = 0; i < imageCount; i++) {
      const index = i;
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: images[i],
        name: 'file',
        success: function(response) {
          uploadedImages[index] = JSON.parse(response.data).data.imgUrl;
          completedCount++;
          succeedCount++;
          if (completedCount === imageCount) {
            onComplete && onComplete(completedCount, succeedCount, uploadedImages);
          }
        },
        fail: function(error) {
          completedCount++;
          if (completedCount === imageCount) {
            onComplete && onComplete(completedCount, succeedCount);
          }
        }
      });
    }
  }
});
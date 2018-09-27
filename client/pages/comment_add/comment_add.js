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

    if(!content){
      wx.hideLoading();
      wx.showModal({
        title: 'Comment is empty',
        content: 'Comment can not be null'
      });
      return;
    }

    const onComplete = function() {
      wx.hideLoading();
    }

    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'POST',
      data: {
        productId: this.data.product.id,
        content: content,
        images: this.data.images
      },
      success: function(response) {
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
  },
  onTapChooseImage: function(event) {
    const page = this;
    wx.chooseImage({
      success: function(res) {
        page.setData({
          images: res.tempFiles
        });
      },
    });
  }
});
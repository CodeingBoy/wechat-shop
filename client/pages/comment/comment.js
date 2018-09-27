const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    product: {},
    comments: []
  },
  onLoad: function(options) {
    const productId = options.id;
    this.loadProductData(productId);
    this.loadComments(productId);
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
  loadComments: function(productId) {
    const page = this;
    qcloud.request({
      url: config.service.getComments + productId,
      success: function(response){
        const comments = response.data.data;
        page.setData({
          comments
        });
      },
      fail: function(error){
        wx.showToast({
          title: 'Load comments failed, please try again later',
          icon: 'none'
        });
        wx.navigateBack();
      }
    })
  }
});
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    product: {},
    comments: [{
      userAvatarUrl: 'https://shop-dev-1252565845.cos.ap-guangzhou.myqcloud.com/product6.jpg',
      userName: 'abc',
      time: '2018-09-26',
      content: 'Great product!'
    }]
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
  loadComments: function(productId) {}
});
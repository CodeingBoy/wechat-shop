// pages/product_detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
  },
  loadProductData: function(productId) {
    const page = this;
    qcloud.request({
      url: config.service.productDetail + productId,
      success: function(response) {
        if (response.data.code !== 0) {
          page.onGetProductDetailFail();
          return;
        }

        const productInfo = response.data.data;
        page.setData({
          product: productInfo
        });

        page.onFinishLoadingProductDetail();
      },
      fail: function() {
        page.onGetProductDetailFail();
        page.onFinishLoadingProductDetail();
      }
    })
  },
  onGetProductDetailFail: function() {
    wx.showToast({
      title: 'Fail loading detail',
      icon: 'none'
    });
    wx.navigateBack({});
  },
  onFinishLoadingProductDetail: function() {
    wx.hideLoading();
  },
  onLoad: function(options) {
    const productId = options.id;
    wx.showLoading({
      title: 'Loading',
    })
    this.loadProductData(productId);
  },
  onTappedBuyButton: function() {
    const page = this;
    qcloud.request({
      url: config.service.buyProduct,
      method: 'POST',
      data: {
        list: [{
          id: page.data.product.id,
          count: 1
        }]
      },
      login: true,
      success: function(response) {
        wx.showToast({
          title: 'Succeed',
          icon: 'success'
        });
      },
      fail: function(error) {
        wx.showToast({
          title: 'Buy failed',
          icon: 'none'
        });
      }
    })
  }
})
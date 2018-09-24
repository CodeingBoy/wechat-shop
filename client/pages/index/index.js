// pages/index/index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    recommendedProduct: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadProducts();
  },

  loadProducts: function(callback){
    wx.showLoading({
      title: 'Loading'
    });

    const onFinishLoading = function () {
      wx.hideLoading();
      typeof callback === 'function' && callback();
    };

    const onFailLoadingProducts = function(){
      wx.showToast({
        title: 'Fail loading products',
        icon: 'none'
      });
    }

    const page = this;
    qcloud.request({
      url: config.service.productList,
      success: function (response) {
        if (response.data.code != 0) {
          onFailLoadingProducts();
          console.log(response);
          return;
        }
        var recommendedProduct = response.data.data[0];
        recommendedProduct.promotionImage = '/images/discount.png';

        page.setData({
          "productList": response.data.data,
          "recommendedProduct": recommendedProduct
        });

        onFinishLoading();
      },
      fail: function (err) {
        console.log(err);

        onFinishLoading();
        onFailLoadingProducts();
      }
    });
  }
})
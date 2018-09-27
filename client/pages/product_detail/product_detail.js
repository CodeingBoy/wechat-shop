// pages/product_detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    commentSummary: {
      count: 0,
      latestComment: ''
    }
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
    this.loadCommentSummary(productId);
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
  },
  onTappedAddToCart: function() {
    const productId = this.data.product.id;
    const userInfo = app.getUserInfo();
    if (!userInfo) {
      wx.showModal({
        title: 'Not logged in',
        content: 'You did not logged in as an user, please login first'
      });
      return;
    }

    qcloud.request({
      url: config.service.addProductToCart,
      method: 'POST',
      login: true,
      data: {
        productId: productId
      },
      success: function(response) {
        wx.showToast({
          title: 'Succeed',
          icon: 'succeed'
        });
      },
      fail: function() {
        wx.showToast({
          title: 'Add failed, please try again later',
          icon: 'none'
        });
      }
    });
  },
  onTapComments: function() {
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + this.data.product.id
    });
  },
  loadCommentSummary: function (productId){
    const page = this;
    qcloud.request({
      url: config.service.getCommentSummary + productId,
      success: function(response){
        page.setData({
          commentSummary: response.data.data
        });
      },
      fail: function(){
        wx.showToast({
          title: 'Fail loading comments',
          icon: 'none'
        });
      }
    });
  }
})
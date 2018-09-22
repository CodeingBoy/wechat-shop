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
  loadProductData: function(productId){
    const page = this;
    qcloud.request({
      url: config.service.productDetail + productId,
      success: function(response){
        const productInfo = response.data.data;
        page.setData({product: productInfo});

        page.onFinishLoadingProductDetail();
      },
      fail: function(){
        wx.showToast({
          title: 'Fail loading detail',
          icon: 'none'
        })

        page.onFinishLoadingProductDetail()
      }  
    })
  },
  onFinishLoadingProductDetail: function(){
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const productId = options.id;
    wx.showLoading({
      title: 'Loading',
    })
    this.loadProductData(productId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
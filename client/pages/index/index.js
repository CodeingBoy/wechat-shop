// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [{
      id: 1,
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product1.jpg',
      name: 'Item 1',
      price: 100,
      source: 'China-GuangDong',
    }, {
      id: 2,
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product2.jpg',
      name: 'Item 2',
      price: 200,
      source: 'China-GuangDong',
    }, {
      id: 3,
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product3.jpg',
      name: 'Item 3',
      price: 300,
      source: 'China-GuangDong',
    }, {
      id: 4,
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product4.jpg',
      name: 'Item 4',
      price: 400,
      source: 'China-GuangDong',
    }, {
      id: 5,
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product5.jpg',
      name: 'Item 5',
      price: 500,
      source: 'China-GuangDong',
    }],
    recommendedProduct: {
      id: 1,
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product1.jpg',
      promotionImage: '/images/discount.png',
      name: 'Item 1',
      price: 100,
      source: 'China-GuangDong',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
// pages/user/user.js

const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow: function(){
    this.refreshUserInfo();
  },
  onTapLoginButton: function(response) {
    const page = this;
    app.onTapLoginButton(response, function(response){
      page.refreshUserInfo();
    });
  },
  refreshUserInfo: function() {
    this.setData({
      userInfo: app.getUserInfo()
    });
  }
})
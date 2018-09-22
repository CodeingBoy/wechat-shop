// pages/user/user.js

const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const app = require("../../app.js");

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
    this.setData({
      userInfo: app.getUserInfo()
    });
  },
  onGetUserInfo: function(response) {
    const page = this;
    if (response.detail.userInfo) {
      qcloud.login({
        success: function(response) {
          console.log(response);
          app.setUserInfo(response);
          page.refreshUserInfo();
        },
        fail: function(err) {
          console.log(err);
          wx.showToast({
            title: 'Login fail, please try again later',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: 'Login cancelled',
        icon: 'none'
      });
    }
  },
  refreshUserInfo: function(){
    this.setData({userInfo: app.getUserInfo()});
  }
})
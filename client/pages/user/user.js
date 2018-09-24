// pages/user/user.js

const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
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
  onTapLoginButton: function(response) {
    wx.showLoading({
      title: 'Logging you in'
    });

    const page = this;
    if (response.detail.userInfo) {
      qcloud.login({
        success: function(response) {
          app.setUserInfo(response);
          page.refreshUserInfo();
          page.onCompleteLoading();
        },
        fail: function(err) {
          console.log(err);
          wx.showToast({
            title: 'Login failed, try again later',
            icon: 'none'
          });
          page.onCompleteLoading();
        }
      });
    } else {
      wx.showToast({
        title: 'Login cancelled',
        icon: 'none'
      });
      page.onCompleteLoading();
    }
  },
  onCompleteLoading: function() {
    wx.hideLoading();
  },
  refreshUserInfo: function() {
    this.setData({
      userInfo: app.getUserInfo()
    });
  }

})
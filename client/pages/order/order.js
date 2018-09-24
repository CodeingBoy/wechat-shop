const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    userInfo: null
  },
  onShow: function () {
    this.refreshUserInfo();
  },
  onTapLoginButton: function (response) {
    const page = this;
    app.onTapLoginButton(response, function (response) {
      page.refreshUserInfo();
    });
  },
  refreshUserInfo: function () {
    this.setData({
      userInfo: app.getUserInfo()
    });
  }
})
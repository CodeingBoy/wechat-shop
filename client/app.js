//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function() {
    qcloud.setLoginUrl(config.service.loginUrl)
    this.loadSessionUserInfo();
  },
  loadSessionUserInfo: function() {
    const page = this;
    wx.checkSession({
      success: function() {
        page.refreshSessionUserInfo();
        sessionValid = true;
      },
      fail: function() {
        console.log("session invalid");
      }
    })
  },
  refreshSessionUserInfo: function() {
    const userInfoPromise = this.getSessionUserInfo()
      .then(function(info) {
        userInfo = info;
      });
  },
  getSessionUserInfo: function() {
    return new Promise((resolve, reject) => {
      qcloud.request({
        url: config.service.requestUrl,
        login: true,
        success: function(response) {
          resolve(response.data.data);
        },
        fail: function(error) {
          console.log(error);
          reject(new Error(error));
        }
      })
    });
  }
});

var userInfo = null;
var sessionValid = false;

module.exports = {
  getUserInfo: function() {
    return userInfo;
  },
  setUserInfo: function(info) {
    userInfo = info;
  },
  getSessionUserInfo: function () {
    return new Promise((resolve, reject) => {
      qcloud.request({
        url: config.service.requestUrl,
        login: true,
        success: function (response) {
          resolve(response.data.data);
        },
        fail: function (error) {
          console.log(error);
          reject(new Error(error));
        }
      })
    });
  }
};
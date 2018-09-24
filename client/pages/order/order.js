const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    userInfo: null,
    orders: []
  },
  onShow: function() {
    this.refreshUserInfo(() => {
      this.refreshUserOrders();
    });
  },
  onTapLoginButton: function(response) {
    const page = this;
    app.onTapLoginButton(response, function(response) {
      page.refreshUserInfo(() => {
        page.refreshUserOrders();
      });      
    });
  },
  refreshUserInfo: function(succeed, fail) {
    const userInfo = app.getUserInfo();
    this.setData({
      userInfo: userInfo
    });
    if (userInfo) {
      typeof succeed === 'function' && succeed();
    } else {
      typeof fail === 'function' && fail();
    }
  },
  refreshUserOrders: function() {
    const page = this;
    qcloud.request({
      url: config.service.orderList,
      login: true,
      success: function(response) {
        page.setData({
          orders: response.data.data
        });
      },
      fail: function() {

      }
    })
  }
})
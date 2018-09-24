const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    userInfo: null,
    orders: [
      {
        id: 0,
        list: [{
          count: 1,
          image: 'https://shop-dev-1252565845.cos.ap-guangzhou.myqcloud.com/product1.jpg',
          name: '商品1',
          price: 50.5,
        }]
      },
      {
        id: 1,
        list: [{
          count: 1,
          image: 'https://shop-dev-1252565845.cos.ap-guangzhou.myqcloud.com/product1.jpg',
          name: '商品1',
          price: 50.5,
        },
        {
          count: 1,
          image: 'https://shop-dev-1252565845.cos.ap-guangzhou.myqcloud.com/product1.jpg',
          name: '商品2',
          price: 50.5,
        }
        ]
      },
      {
        id: 2,
        list: [{
          count: 1,
          image: 'https://shop-dev-1252565845.cos.ap-guangzhou.myqcloud.com/product1.jpg',
          name: '商品2',
          price: 50.15,
        }]
      }
    ]
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
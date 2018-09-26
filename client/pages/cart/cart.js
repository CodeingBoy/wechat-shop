const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    userInfo: null,
    items: [],
    cartCheckMap: [],
    totalPrice: 233,
    isEditing: false,
    isSelectingAll: true
  },
  onShow: function() {
    this.refreshUserInfo();
    this.refreshCartItems();
  },
  onTapLoginButton: function(response) {
    const page = this;
    app.onTapLoginButton(response, function(response) {
      page.refreshUserInfo();
      page.refreshCartItems();
    });
  },
  refreshUserInfo: function() {
    this.setData({
      userInfo: app.getUserInfo()
    });
  },
  onTapSelectAll: function() {
    var isSelectingAll = !this.data.isSelectingAll;

    const length = this.data.cartCheckMap.length;
    var newCartCheckMap = new Array(length);
    if (isSelectingAll) {
      for (var i = 1; i < length; i++) {
        newCartCheckMap[i] = true;
      }
    } else {
      for (var i = 1; i < length; i++) {
        newCartCheckMap[i] = false;
      }
    }

    this.setData({
      isSelectingAll: isSelectingAll,
      cartCheckMap: newCartCheckMap
    });
  },
  onTapEdit: function() {
    this.setData({
      isEditing: !this.data.isEditing
    });
  },
  onTapIncreaseItemCount: function(event) {
    const index = event.currentTarget.dataset.index;
    const newCount = this.data.items[index].count + 1;
    const pathText = 'items[' + index + '].count';
    this.setData({
      [pathText]: newCount
    });
  },
  onTapDecreaseItemCount: function(event) {
    const index = event.currentTarget.dataset.index;
    const newCount = this.data.items[index].count - 1;
    if (newCount <= 0) {
      var items = this.data.items;
      items.splice(index, 1);
      this.setData({
        items: items
      });
      return;
    }

    const pathText = 'items[' + index + '].count';
    this.setData({
      [pathText]: newCount
    });
  },
  onTapItemSelection: function(event) {
    const id = event.currentTarget.dataset.id;
    const pathText = 'cartCheckMap[' + id + ']';
    var selected = this.data.cartCheckMap[id];
    if (typeof selected === 'undefined') {
      selected = true;
    } else {
      selected = !selected;
    }
    if (!selected && this.data.isSelectingAll) {
      this.setData({
        isSelectingAll: false
      });
    }

    this.setData({
      [pathText]: selected
    });
  },
  refreshCartItems: function() {
    wx.showLoading({
      title: 'Loading'
    });

    const page = this;
    qcloud.request({
      url: config.service.getCartItems,
      login: true,
      success: function(response) {
        wx.hideLoading();
        page.setData({
          items: response.data.data
        });
      },
      fail: function(error) {
        wx.hideLoading();
        wx.showToast({
          title: 'Fail loading cart items, please try again later',
          icon: 'none'
        });
      }
    })
  }
})
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    userInfo: null,
    items: [],
    cartCheckMap: {},
    totalPrice: 0,
    isEditing: false,
    isSelectingAll: false,
    selectedCount: 0
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

    const length = this.data.items.length;
    var newCartCheckMap = {};
    if (isSelectingAll) {
      for (let i = 0; i < length; i++) {
        const product = this.data.items[i];
        newCartCheckMap[product.id] = true;
      }
    } else {
      for (let i = 0; i < length; i++) {
        const product = this.data.items[i];
        newCartCheckMap[product.id] = false;
      }
    }

    var selectedCount = isSelectingAll ? this.data.items.length : 0;

    this.setData({
      isSelectingAll: isSelectingAll,
      cartCheckMap: newCartCheckMap,
      selectedCount
    });

    this.updateTotalPrice();
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

    this.updateTotalPrice();
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

    this.updateTotalPrice();
  },
  onTapItemSelection: function(event) {
    const id = event.currentTarget.dataset.id;
    const pathText = 'cartCheckMap.' + id;
    var selected = this.data.cartCheckMap[id];
    if (typeof selected === 'undefined') {
      selected = true;
    }
    selected = !selected;

    var selectedCount = this.data.selectedCount;
    selectedCount = selected ? selectedCount + 1 : selectedCount - 1;

    const isSelectingAll = selectedCount >= this.data.items.length;

    this.setData({
      [pathText]: selected,
      selectedCount,
      isSelectingAll
    });

    this.updateTotalPrice();
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
        page.onTapSelectAll();
      },
      fail: function(error) {
        wx.hideLoading();
        wx.showToast({
          title: 'Fail loading cart items, please try again later',
          icon: 'none'
        });
      }
    });
  },
  updateTotalPrice: function() {
    var totalPrice = 0;
    const itemCount = this.data.items.length;
    for (let id in this.data.cartCheckMap) {
      if (this.data.cartCheckMap[id]) {
        for (let i = 0; i < itemCount; i++) {
          const product = this.data.items[i];
          if (product.id == id) {
            totalPrice += product.price * product.count;
            break;
          }
        }
      }
    }

    this.setData({
      totalPrice: totalPrice.toFixed(2)
    });
  },
  updateSelectedCount: function() {
    const cartCheckMap = this.data.cartCheckMap;
    const length = this.data.items.length;

    var selectedCount = 0;
    for (let i = 0; i < length; i++) {
      const product = cartCheckMap[i];
      if (cartCheckMap[product.id]) {
        selectedCount++;
      }
    }

    this.setData({
      selectedCount
    });

    return selectedCount;
  }
})
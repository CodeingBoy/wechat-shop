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
    if (this.data.isEditing) {
      var productInfos = this.data.items.map(function(p) {
        return {
          id: p.id,
          count: p.count
        }
      });

      qcloud.request({
        url: config.service.updateCart,
        method: 'PUT',
        login: true,
        data: {
          list: productInfos
        },
        success: function(response) {

        },
        fail: function(error) {
          wx.showToast({
            title: 'Network error',
            icon: 'none'
          });
        }
      })
    }

    this.setData({
      isEditing: !this.data.isEditing
    });
    this.updateTotalPrice();
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
      const productId = items[index].id;
      items.splice(index, 1);

      var selectedCount = this.data.selectedCount - 1;
      var cartCheckMap = this.data.cartCheckMap;

      delete cartCheckMap[productId];

      this.setData({
        items,
        selectedCount,
        cartCheckMap
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
  },
  onTapCheckout: function() {
    const items = this.data.items;
    const itemCount = this.data.items.length;
    const cartCheckMap = this.data.cartCheckMap;

    var productInfos = [];
    for (let id in cartCheckMap) {
      if (!cartCheckMap[id]) {
        continue;
      }
      for (let i = 0; i < itemCount; i++) {
        const product = items[i];
        if (product.id == id) {
          productInfos.push({
            id: product.id,
            count: product.count
          });
          break;
        }
      }
    }

    const page = this;
    qcloud.request({
      url: config.service.buyProduct,
      method: 'POST',
      login: true,
      data: {
        list: productInfos
      },
      success: function(response) {
        wx.showToast({
          title: 'Success',
          icon: 'success'
        });

        var productIds = productInfos.map(function(p) {
          return p.id;
        });
        page.removeItems(productIds);
      },
      fail: function(error) {
        wx.showModal({
          title: 'Order failed',
          content: 'Fail processing your order, please try again later'
        });
      }
    })
  },
  removeItems: function(productIds) {
    const items = this.data.items;
    const cartCheckMap = this.data.cartCheckMap;
    const idCount = productIds.length;
    var selectedCount = this.data.selectedCount;

    for (let i = 0; i < idCount; i++) {
      const productId = productIds[i];
      delete cartCheckMap[productId];
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == productId) {
          items.splice(i, 1);
          break;
        }
      }
      selectedCount--;
    }

    this.setData({
      items,
      cartCheckMap,
      selectedCount
    });

    this.updateTotalPrice();

    var productInfos = items.map(function(p) {
      return {
        id: p.id,
        count: p.count
      };
    });

    qcloud.request({
      url: config.service.updateCart,
      method: 'PUT',
      login: true,
      data: {
        list: productInfos
      },
      success: function(response) {

      },
      fail: function(error) {
        wx.showToast({
          title: 'Clear cart failed',
          icon: 'none'
        });
      }
    });
  }
})
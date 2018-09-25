const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

Page({
  data: {
    userInfo: null,
    items: [{
        id: 1,
        name: '商品1',
        image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product1.jpg',
        price: 45,
        source: '海外·瑞典',
        count: 1,
      }, {
        id: 2,
        name: '商品2',
        image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product2.jpg',
        price: 158,
        source: '海外·新西兰',
        count: 3,
      },
      {
        id: 1,
        name: '商品1',
        image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product1.jpg',
        price: 45,
        source: '海外·瑞典',
        count: 1,
      }, {
        id: 2,
        name: '商品2',
        image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product2.jpg',
        price: 158,
        source: '海外·新西兰',
        count: 3,
      },
      {
        id: 1,
        name: '商品1',
        image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product1.jpg',
        price: 45,
        source: '海外·瑞典',
        count: 1,
      }, {
        id: 2,
        name: '商品2',
        image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product2.jpg',
        price: 158,
        source: '海外·新西兰',
        count: 3,
      }
    ],
    cartCheckMap: [undefined, true, undefined],
    totalPrice: 233,
    isEditing: false,
    isSelectingAll: true
  },
  onShow: function() {
    this.refreshUserInfo();
  },
  onTapLoginButton: function(response) {
    const page = this;
    app.onTapLoginButton(response, function(response) {
      page.refreshUserInfo();
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
  }
})
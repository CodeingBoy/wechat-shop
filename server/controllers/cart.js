const db = require('../utils/db.js');

module.exports = {
  add: async ctx => {
    const userId = ctx.state.$wxInfo.userinfo.openId;
    const productId = ctx.request.body.productId;

    const cartItemCount = await db.query('SELECT COUNT(*) FROM cart_user WHERE id = ? AND user = ?', [productId, userId]);

    if (cartItemCount[0]['COUNT(*)'] == 0) {
      await db.query("INSERT INTO cart_user(id, user, count) VALUES (?, ?, 1)", [productId, userId]);
    } else {
      await db.query("UPDATE cart_user SET count = count + 1 WHERE id = ? AND user = ?", [productId, userId]);
    }
  },
  list: async ctx => {
    const userId = ctx.state.$wxInfo.userinfo.openId;

    const cartItems = await db.query("SELECT p.*, c.count FROM cart_user AS c JOIN product AS p ON c.id = p.id WHERE c.user = ?", [userId]);

    ctx.state.data = cartItems;
  }
};
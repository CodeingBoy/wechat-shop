const db = require('../utils/db.js');

module.exports = {
  add: async ctx => {
    const userId = ctx.state.$wxInfo.userinfo.openId;
    const username = ctx.state.$wxInfo.userinfo.nickName;
    const avatarUrl = ctx.state.$wxInfo.userinfo.avatarUrl;
    const productId = ctx.request.body.productId;
    const content = ctx.request.body.content;

    await db.query("INSERT INTO comment(user, username, avatar, content, images, product_id, create_time) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", [userId, username, avatarUrl, content, null, productId]);
  },
  list: async ctx => {
    const comments = await db.query("SELECT * FROM comment WHERE product_id = ?", [productId]);
    ctx.state.data = comments;
  }
};
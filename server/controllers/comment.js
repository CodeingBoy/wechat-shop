const db = require('../utils/db.js');

module.exports = {
  add: async ctx => {
    const userId = ctx.state.$wxInfo.userinfo.openId;
    const username = ctx.state.$wxInfo.userinfo.nickName;
    const avatarUrl = ctx.state.$wxInfo.userinfo.avatarUrl;
    const productId = ctx.request.body.productId;
    const content = ctx.request.body.content;
    var images = ctx.request.body.images || [];
    var imagesString = null;

    if (images) {
      imagesString = images.join(";;");
    }

    await db.query("INSERT INTO comment(user, username, avatar, content, images, product_id, create_time) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", [userId, username, avatarUrl, content, imagesString, productId]);
  },
  get: async ctx => {
    const productId = Number(ctx.params.id);
    const comments = await db.query("SELECT * FROM comment WHERE product_id = ?", [productId]);
    ctx.state.data = comments.map(function(c) {
      var result = {
        userAvatarUrl: c.avatar,
        userName: c.username,
        time: c.create_time.toISOString().substr(0, 10),
        content: c.content
      };
      if (c.images) {
        result.images = c.images.split(';;').filter(function(i) {
          return Boolean(i);
        });
      }
      return result;
    });
  },
  getSummary: async ctx => {
    var result = {};

    const productId = Number(ctx.params.id);
    const commentCount = await db.query("SELECT COUNT(*) FROM comment WHERE product_id = ?", [productId]);
    result.count = commentCount[0]['COUNT(*)'];

    if (result.count > 0) {
      const latestComment = await db.query("SELECT * FROM comment WHERE product_id = ? ORDER BY create_time LIMIT 0, 1", [productId]);
      result.latestComment = latestComment[0].content;
    }
    ctx.state.data = result;
  }
};
const db = require("../utils/db.js");

module.exports = {
  list: async ctx => {
    ctx.state.data = await db.query("SELECT * FROM product;");
  },
  detail: async ctx => {
    const productId = Number(ctx.params.id);
    ctx.state.data = await db.query("SELECT * FROM product WHERE id = ?", [productId]);
  }
}
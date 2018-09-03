const db = require("../utils/db.js");

module.exports = {
  list: async ctx => {
    ctx.state.data = await db.query("SELECT * FROM product;");
  }
}
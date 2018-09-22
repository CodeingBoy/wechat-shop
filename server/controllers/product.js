const db = require("../utils/db.js");

module.exports = {
  list: async ctx => {
    ctx.state.data = await db.query("SELECT * FROM product;");
  },
  detail: async ctx => {
    const productId = Number(ctx.params.id);
    if(isNaN(productId)){
      ctx.state.data = {};
      return;
    }

    const results = await db.query("SELECT * FROM product WHERE id = ?", [productId]);
    if(results && results[0]){
      ctx.state.data = results[0];
    }else{
      ctx.state.data = {};
    }
  }
}
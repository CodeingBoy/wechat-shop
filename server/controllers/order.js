const db = require('../utils/db.js');

module.exports = {
  add: async ctx => {
    const userId = ctx.state.$wxInfo.userinfo.openId;

    const order = await db.query("INSERT INTO order_user(user) VALUES (?)", [userId]);
    const orderId = order.insertId;

    var products = ctx.request.body.list || [];

    var insertOrderProductSql = "INSERT INTO order_product(order_id, product_id, count) VALUES";
    var params = [];
    const length = products.length;
    for (var i = 0; i < length; i++) {
      const p = products[i];
      params.push(orderId);
      params.push(p.id);
      params.push(p.count || 1);

      insertOrderProductSql += " (?, ?, ?), ";
    }
    insertOrderProductSql = insertOrderProductSql.substring(0, insertOrderProductSql.length - 2);

    await db.query(insertOrderProductSql, params);
  },
  list: async ctx => {
    const userId = ctx.state.$wxInfo.userinfo.openId;

    const userOrders = await db.query("SELECT * FROM order_user WHERE user = ?", [userId]);

    const orderCount = userOrders.length;
    for(var i = 0;i < orderCount;i++){
      var order = userOrders[i];
      const orderId = order.id;
      const orderProducts = await db.query("SELECT p.*, o.count FROM order_product AS o JOIN product AS p ON o.product_id = p.id WHERE o.order_id = ?", [orderId]);
      
      order.list = orderProducts;
    }
   
    ctx.state.data = userOrders;
  }
};
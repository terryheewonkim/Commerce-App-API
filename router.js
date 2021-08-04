const Router = (app) => {
  const ProductController = require("./controllers/ProductController");

  // product list
  // params: type (new / best / md)
  app.get("/commerce-app/product", (req, res) => {
    ProductController.getProductList(req, res);
  });

  // cart list
  // params: cartList [{prod_idx: 1, prod_qty: 1}]
  app.get("/commerce-app/cart/product", (req, res) => {
    ProductController.getCartProductList(req, res);
  });

  // main product list
  app.get("/commerce-app/main/product", (req, res) => {
    ProductController.getMainProductList(req, res);
  });

  // product detail
  app.get("/commerce-app/product/detail/:prod_idx", (req, res) => {
    ProductController.getProductDetail(req, res);
  });
};

module.exports = Router;

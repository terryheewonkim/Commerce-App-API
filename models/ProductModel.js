const ProductModel = () => {
  const model = require("./Model");

  const get_product_list = (data, callback) => {
    let query = "";

    // different queries for if there is a type or not
    if (data.type) {
      query =
        "SELECT * FROM prod p JOIN prod_type pt ON p.prod_type_idx = pt.type_idx WHERE pt.type_name=:type";
    } else {
      query = "SELECT * FROM prod";
    }
    model.execute(query, data, callback);
  };

  const get_cart_product_list = (data, callback) => {
    model.execute("SELECT * FROM prod WHERE prod_idx IN (" + data.index + ")", data, callback);
  };

  const get_type_list = (data, callback) => {
    model.execute("SELECT * FROM prod_type", data, callback);
  };

  const get_main_product_list = (data, callback) => {
    model.execute(
      "SELECT * FROM prod p JOIN prod_type pt ON p.prod_type_idx = pt.type_idx WHERE pt.type_name=:type LIMIT 0,3",
      data,
      callback
    );
  };

  const get_product_detail = (data, callback) => {
    model.execute("SELECT * FROM prod WHERE prod_idx=:prod_idx", data, callback);
  };

  return {
    getProductList: (data, callback) => get_product_list(data, callback),
    getCartProductList: (data, callback) => get_cart_product_list(data, callback),
    getTypeList: (data, callback) => get_type_list(data, callback),
    getMainProductList: (data, callback) => get_main_product_list(data, callback),
    getProductDetail: (data, callback) => get_product_detail(data, callback),
  };
};

module.exports = ProductModel();

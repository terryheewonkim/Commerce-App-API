const { response } = require("express");

const ProductController = () => {
  const prod_model = require("../models/ProductModel");

  const getProductList = (req, res) => {
    let model_data = {};

    const getType = () => {
      return new Promise((resolve) => {
        if (req.query.type) {
          model_data.type = req.query.type;
        }
        resolve();
      });
    };

    const getList = () => {
      return new Promise(() => {
        prod_model.getProductList(model_data, (err, rows) => {
          if (err) {
            res.json({
              result: false,
              msg: "INTERNAL_SERVER_ERROR",
            });
          } else {
            res.json({
              result: true,
              msg: "SUCCESS",
              data: rows,
            });
          }
        });
      });
    };

    getType().then(() => getList());
  };

  const getCartProductList = (req, res) => {
    let model_data = {};

    const { cartList } = req.query;

    const makeIndexArray = () => {
      return new Promise((resolve) => {
        model_data.index = [];
        cartList.forEach((v) => {
          model_data.index.push(parseInt(v.prod_idx));
        });
        resolve();
      });
    };

    const getProductList = () => {
      return new Promise((resolve) => {
        prod_model.getCartProductList(model_data, (err, rows) => {
          if (err) {
            res.json({
              result: false,
              msg: "INTERNAL_SERVER_ERROR",
            });
          } else {
            resolve(rows);
          }
        });
      });
    };

    const sendResponse = (prod_list) => {
      let send_array = prod_list.map((v) => {
        let qty = 0;
        cartList.forEach((val) => {
          if (parseInt(val.prod_idx) === v.prod_idx) {
            qty = parseInt(val.prod_qty);
          }
        });
        v.prod_qty = qty;
        return v;
      });
      res.json({
        result: true,
        msg: "SUCCESS",
        data: send_array,
      });
    };

    makeIndexArray()
      .then(() => getProductList())
      .then((prod_list) => sendResponse(prod_list));
  };

  const getMainProductList = (req, res) => {
    let model_data = {};
    let response_data = {};

    const getTypeList = () => {
      return new Promise((resolve) => {
        prod_model.getTypeList({}, (err, rows) => {
          if (err) {
            console.log(err);
            res.json({
              result: false,
              msg: "INTERNAL_SERVER_ERROR",
            });
          } else {
            resolve(rows);
          }
        });
      });
    };

    const getProductList = (type_list) => {
      return new Promise((resolve) => {
        let total = type_list.length;
        let count = 0;
        let flag = true;

        const selecting = () => {
          model_data.type = type_list[count].type_name;
          console.log(model_data.type);
          prod_model.getMainProductList(model_data, (err, rows) => {
            if (err) {
              console.log(err);
              res.json({
                result: false,
                msg: "INTERNAL_SERVER_ERROR",
              });
            } else {
              response_data[model_data.type + "_list"] = rows;
              if (++count === total) {
                resolve();
              } else {
                selecting();
              }
            }
          });
        };
      });
    };

    const response = () => {
      res.json({
        result: true,
        msg: "SUCCESS",
        data: response_data,
      });
    };

    getTypeList()
      .then((type) => getProductList(type))
      .then(() => response());
  };

  const getProductDetail = (req, res) => {
    const getDetail = () => {
      prod_model.getProductDetail({ prod_idx: req.params.prod_idx }, (err, rows) => {
        if (err) {
          console.log(err);
          res.json({
            result: false,
            msg: "INTERNAL_SERVER_ERROR",
          });
        } else {
          if (rows[0]) {
            res.json({
              result: true,
              msg: "SUCCESS",
              data: rows[0],
            });
          } else {
            res.json({
              result: false,
              msg: "DATA_NON_EXISTENT",
            });
          }
        }
      });
    };
    getDetail();
  };

  // RETURN THE CONTROLLER
  return {
    getProductList: (req, res) => getProductList(req, res),
    getCartProductList: (req, res) => getCartProductList(req, res),
    getMainProductList: (req, res) => getMainProductList(req, res),
    getProductDetail: (req, res) => getProductDetail(req, res),
  };
};

module.exports = ProductController();

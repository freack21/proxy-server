const { sendJSON } = require("../util");
const config = require("./config");

const routing = (req, res) => {
  const url = req.url;
  const path = url.split("?")[0];
  switch (path) {
    case "/":
      sendJSON(res, 200, { msg: "Welcome to Reserve Proxy Server!" });
      break;
    case "/config":
      config(req, res);
      break;
    default:
      sendJSON(res, 404, { msg: "Not Found" });
  }
};

module.exports = routing;

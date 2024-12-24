const {
  queryToJSON,
  loadConfig,
  setConfigValue,
  sendJSON,
} = require("../util");

const config = (req, res) => {
  let CONFIG = loadConfig();

  if (req.method === "GET") {
    const query = req.url.split("?")[1] || "";
    const data = queryToJSON(query);
    if (data.key != process.env.SECRET_KEY) {
      return sendJSON(res, 401, { msg: "Unauthorized" });
    }
    if (!data.act || data.act == "get") return sendJSON(res, 200, CONFIG);
    else if (data.act == "set") {
      delete data.key;
      delete data.act;

      for (const key in data) {
        const port = Number(data[key]);
        if (isNaN(port) || port < 0) continue;
        setConfigValue(key, port);
      }

      return sendJSON(res, 200, loadConfig());
    }
  } else {
  }
};

module.exports = config;

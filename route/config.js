const { queryToJSON, loadConfig, setConfigValue } = require("../util");

const config = (req, res) => {
  let CONFIG = loadConfig();

  if (req.method === "GET") {
    const query = req.url.split("?")[1] || "";
    const data = queryToJSON(query);
    if (data.key == process.env.SECRET_KEY) {
      return sendJSON(res, 200, CONFIG);
    }
    return sendJSON(res, 401, { msg: "Unauthorized" });
  } else if (req.method === "POST") {
    const query = req.url.split("?")[1] || "";
    const data = queryToJSON(query);
    if (data.key != process.env.SECRET_KEY) {
      return sendJSON(res, 401, { msg: "Unauthorized" });
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        for (const key in data) {
          setConfigValue(key, data[key]);
        }

        return sendJSON(res, 200, CONFIG);
      } catch (e) {
        return sendJSON(res, 400, { msg: "Invalid JSON" });
      }
    });
  }
};

module.exports = config;

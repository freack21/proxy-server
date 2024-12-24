const fs = require("fs");
const path = require("path");
const CONFIG_PATH = path.join(__dirname, "./config.json");
let CONFIG = loadConfig();

const loadConfig = () => {
  try {
    return JSON.parse(fs.readFileSync("config.json", "utf8"));
  } catch (e) {
    console.log("Error loading config file");
    return {};
  }
};

const setConfigValue = (key, value) => {
  const CONFIG_VARS = loadConfig();

  CONFIG_VARS[key] = value;

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(CONFIG_VARS, null, 2));

  CONFIG = loadConfig();
};

const parseDomain = (domain) => {
  const superDomain = process.env.DOMAIN.split(".").slice(1).join(".");
  const regex = new RegExp(`^(?:(\\w+)\\.)?(\\w+)\\.${superDomain}$`);
  const match = domain.match(regex) || [];

  return match[1] || match[2] || "";
};

const getPortForSubdomain = (subdomain) => {
  return CONFIG[subdomain] || (CONFIG[subdomain] == 0 ? 0 : -1);
};

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const redirect = (req, res) => {
  const host = req.headers.host;
  location = `https://${host}${req.url}`;
  res.writeHead(301, { Location: location });
  res.end();
};

const queryToJSON = (query) => {
  const data = {};

  query &&
    query.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      data[key] = value;
    });

  return data;
};

module.exports = {
  parseDomain,
  getPortForSubdomain,
  sendJSON,
  redirect,
  queryToJSON,
  loadConfig,
  setConfigValue,
};

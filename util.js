const config = require("./config");

const parseDomain = (domain) => {
  const regex = /^(?:(\w+)\.)?(\w+)/;
  const match = domain.match(regex) || [];

  return match[1] || match[2] || "";
};

const getPortForSubdomain = (subdomain) => {
  return config[subdomain] || -1;
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

module.exports = {
  parseDomain,
  getPortForSubdomain,
  sendJSON,
  redirect,
};

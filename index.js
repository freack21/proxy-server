const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const https = require("https");
const http = require("http");
const fs = require("fs");
const httpProxy = require("http-proxy");
const {
  getPortForSubdomain,
  parseDomain,
  sendJSON,
  redirect,
} = require("./util");

const sslOptions = {
  key: fs.readFileSync(
    `/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`
  ),
  cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`),
  ca: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/chain.pem`),
};

const proxy = httpProxy.createProxyServer({});

const server = https.createServer(sslOptions, (req, res) => {
  const host = req.headers.host || "";
  const subdomain = parseDomain(host);
  const port = getPortForSubdomain(subdomain);

  if (port === -1) {
    return sendJSON(res, 404, { msg: "Not Found" });
  } else if (port === 0) {
    return sendJSON(res, 200, { msg: "Hello World" });
  }

  proxy.web(req, res, { target: `http://127.0.0.1:${port}` });
});

server.listen(443, () => {
  console.log("Proxy Server running on https://" + process.env.DOMAIN);
});

http
  .createServer((req, res) => {
    redirect(req, res);
  })
  .listen(80, () => {
    console.log("HTTP Redirect Server running!");
  });

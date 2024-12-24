const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const https = require("https");
const http = require("http");
const fs = require("fs");
const httpProxy = require("http-proxy");

const sslOptions = {
  key: fs.readFileSync(
    `/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`
  ),
  cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`),
  ca: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/chain.pem`),
};

const proxy = httpProxy.createProxyServer({});

function getPortForSubdomain(subdomain, firstDomain) {
  const myFirstDomain = process.env.DOMAIN.split(".")[0];
  if (firstDomain == myFirstDomain) {
    return 0;
  }

  switch (subdomain) {
    case "moviepass":
      return 3200;
    case "www":
      return 0;
    default:
      return -1;
  }
}

const server = https.createServer(sslOptions, (req, res) => {
  const myDomain = process.env.DOMAIN.split(".").join("\\.");
  const regex = new RegExp(`^([a-zA-Z0-9-]+)\\.${myDomain}$`);

  const host = req.headers.host || "";
  const match = host.match(regex);

  const subdomain = match ? match[1] : "";
  const firstDomain = host.split(".")[0];

  const port = getPortForSubdomain(subdomain, firstDomain);

  if (port === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end({ msg: "Not Found" });
    return;
  } else if (port === 0) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end({ msg: "Hello World" });
    return;
  }

  proxy.web(req, res, { target: `http://127.0.0.1:${port}` });
});

server.listen(443, () => {
  console.log("Proxy server running on https://" + process.env.DOMAIN);
});

http
  .createServer((req, res) => {
    const host = req.headers.host;
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
  })
  .listen(80, () => {
    console.log("HTTP Redirect Server running!");
  });

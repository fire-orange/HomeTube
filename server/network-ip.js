const { networkInterfaces } = require("os");

const netInterfaces = networkInterfaces();
const networks = Object.create(null);

for (const name of Object.keys(netInterfaces)) {
  for (const net of netInterfaces[name]) {
    if (net.family === "IPv4" && !net.internal) {
      if (!networks[name]) {
        networks[name] = [];
      }
      networks[name].push(net.address);
    }
  }
}

let IPv4;

if ("Ethernet" in networks) {
  IPv4 = networks["Ethernet"][0];
} else {
  if ("Wi-Fi" in networks) {
    IPv4 = networks["Wi-Fi"][0];
  }
}

module.exports = IPv4;
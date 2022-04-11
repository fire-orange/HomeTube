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
const networkPriorityList = ["Ethernet", "Wi-Fi"];

for (let index = 0; index < networkPriorityList.length; index++) {
  const network = networkPriorityList[index];
  if (network in networks) {
    IPv4 = networks[network][0];
    break;
  }
}

module.exports = IPv4;

const { networkInterfaces } = require("os");

const netInterfaces = networkInterfaces();
const networks = Object.create(null);

//get list of networks connected and store it in networks
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

let IPv4 = "localhost";
const networkPriorityList = ["Ethernet", "Wi-Fi", "en0"];
//check for networks avaible based on the priority list and select the
//first network that appears
for (let index = 0; index < networkPriorityList.length; index++) {
  const network = networkPriorityList[index];
  if (network in networks) {
    IPv4 = networks[network][0];
    break;
  }
}

module.exports = IPv4;

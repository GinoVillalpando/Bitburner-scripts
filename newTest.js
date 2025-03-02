/** @param {NS} ns */
export async function main(ns) {
  const { getPurchasedServers, getPurchasedServerMaxRam } = ns;
  const server = getPurchasedServers()[0];
  const maxServerRam = getPurchasedServerMaxRam();

  ns.tprint(`${server} ${ns.formatNumber(ns.getPurchasedServerCost(maxServerRam))}`);
}
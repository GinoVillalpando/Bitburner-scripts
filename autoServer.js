/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer, getPurchasedServers, getHostname, exec, pid } = ns;
  const { money } = getPlayer();
  let hostName = getHostname();


  exec("tail.js", 'home', 1, ...[pid]);

  if (ns.args.length === 0) {
    ns.args.push(500000000);
  }

  ns.disableLog('sleep');

  exec('shareScripts.js', 'home');

  if (money >= ns.args[0]) {
    exec('purchaseServers.js', 'auto-server');
    await ns.sleep(5000);

    exec('upgradeServers.js', 'auto-server');
    await ns.sleep(5000);
  }


}
/** @param {NS} ns */
export async function main(ns) {
  const { getPurchasedServers, scp } = ns;
  const servers = getPurchasedServers();

  for (const server of servers) {
    const scripts = ns.ls('home', '.js');

    scp(scripts, server, 'home');

    ns.print(ns.scriptRunning('remoteHack.js', server));

    if (!ns.scriptRunning('remoteHack.js', server)) {
      ns.exec('run-with-most-threads.js', server, 1, ...['remoteHack.js'])
    }
  }
}
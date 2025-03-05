/** @param {NS} ns */
export async function main(ns) {

  if (!ns.isRunning('background.js')) {
    ns.exec('background.js', 'home');
    await ns.sleep(1000);
  }

  ns.exec('shareScripts.js', 'home');
  await ns.sleep(1000);

  if (!ns.scriptRunning('weaken.js', 'joesguns-opp')) {
    ns.exec('run-with-most-threads.js', 'home', 1, ...['weaken.js']);
    await ns.sleep(1000);
  }

  if (!ns.scriptRunning('weaken.js', 'remote-hack-1')) {
    ns.exec('run-with-most-threads.js', 'home', 1, ...['weaken.js']);
    await ns.sleep(1000);
  }

  if (!ns.scriptRunning('hacknet.js', 'hacknet-nodes') || !ns.scriptRunning('autoHacknet.js', 'hacknet-nodes')) {
    ns.exec('initializeHacknet.js', 'home');
    await ns.sleep(1000);
  }

  if (!ns.scriptRunning('upgradeServers.js', 'auto-server')) {
    ns.exec('autoServer.js', 'home');
    await ns.sleep(1000);
  }

  if (!ns.isRunning('remoteHack.js')) {
    ns.exec('run-with-most-threads.js', 'home', 1, ...['remoteHack.js']);
    await ns.sleep(1000);
  }

  ns.exec('autoTrigger.js', 'home');
  await ns.sleep(1000);
}
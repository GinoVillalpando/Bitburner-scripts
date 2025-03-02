/** @param {NS} ns */
export async function main(ns) {
  ns.exec('background.js', 'home');
  ns.exec('shareScripts.js', 'home');
  await ns.asleep(3000);

  ns.exec('initializeHacknet.js', 'home');
  await ns.asleep(3000);

  ns.exec('autoTrigger.js', 'home');
  await ns.asleep(3000);

  ns.exec('background.js', 'home');
}
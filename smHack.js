/** @param {NS} ns */
export async function main(ns) {
  const { getHostname, hackAnalyzeChance, hack, print, exec, getServerMoneyAvailable, atExit, closeTail, pid } = ns;
  const hostName = getHostname();
  let moneyAvailable = getServerMoneyAvailable(hostName);
  let isHackable = true;

  if (ns.args[0] === 'tail') {
    exec("tail.js", 'home', 1, ...[pid]);
  }

  while (isHackable) {
    const chance = hackAnalyzeChance(hostName);
    moneyAvailable = getServerMoneyAvailable(hostName);

    print(`hack chance: ${chance}`);
    await hack(hostName);

    if (moneyAvailable <= 0 && chance < 0.4) {
      isHackable = false;
    }
  }

  atExit(() => {
    exec("smGrow.js", hostName);
    closeTail(pid);
  })
}
/** @param {NS} ns */
export async function main(ns) {
  const {
    getHostname,
    hackAnalyzeChance,
    hack,
    print,
    exec,
    getServerMoneyAvailable,
    atExit,
    closeTail,
    pid,
    spawn
  } = ns;

  if (ns.args[0] === 'tail') {
    exec("tail.js", 'home', 1, ...[pid]);
  }

  const threads = ns.args[0] >= 1 ? ns.args[0] : 1;
  const hostName = getHostname();
  const growT = (Math.floor(ns.getServerMaxRam(hostName) / ns.getScriptRam("smGrow.js")));

  let moneyAvailable = getServerMoneyAvailable(hostName);
  let isHackable = true;

  while (isHackable) {
    const chance = hackAnalyzeChance(hostName);
    moneyAvailable = getServerMoneyAvailable(hostName);

    print(`hack chance: ${chance}`);
    await hack(hostName, { threads, stock: true });

    if (moneyAvailable <= 0 || chance < 0.4) {
      isHackable = false;
    }
  }

  if (growT === 0) {
    spawn("smGrow.js")
  } else {
    spawn("smGrow.js", growT, ...[growT])
  }

  atExit(() => {
    closeTail(pid);
  })
}
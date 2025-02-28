/** @param {NS} ns */
export async function main(ns) {
  const {
    getHostname,
    getServerSecurityLevel,
    getServerMinSecurityLevel,
    hackAnalyzeChance,
    exec,
    print,
    weaken,
    atExit,
    closeTail,
    pid,
    spawn
  } = ns;

  if (ns.args[0] === 'tail') {
    exec("tail.js", 'home', 1, ...[pid]);
  }

  const hostName = getHostname();
  let isNotWeak = true;
  const threads = ns.args[0] >= 1 ? ns.args[0] : 1;
  const hackT = (Math.floor(ns.getServerMaxRam(hostName) / ns.getScriptRam("smHack.js")));

  while (isNotWeak) {
    const serverSecurityLvl = getServerSecurityLevel(hostName);
    const minimalSecurityLvl = getServerMinSecurityLevel(hostName);
    const chance = hackAnalyzeChance(hostName);

    print(`hack chances: ${ns.formatPercent(chance)}% for ${hostName}`)

    await weaken(hostName, { threads, stock: true })
    print(`security level: ${serverSecurityLvl} | min security level: ${minimalSecurityLvl}`);

    if (serverSecurityLvl <= minimalSecurityLvl || chance >= 0.5) {
      isNotWeak = false;
    }
  }

  if (hackT === 0) {
    spawn("smHack.js")
  } else {
    spawn("smHack.js", hackT, ...[hackT])
  }

  atExit(() => {
    closeTail(pid);
  })
}
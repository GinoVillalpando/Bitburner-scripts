/** @param {NS} ns */
export async function main(ns) {
  const { getHostname, getServerSecurityLevel, getServerMinSecurityLevel, hackAnalyzeChance, exec, print, weaken, atExit, closeTail, pid } = ns;

  const hostName = getHostname();
  let isNotWeak = true;

  if (ns.args[0] === 'tail') {
    exec("tail.js", 'home', 1, ...[pid]);
  }

  while (isNotWeak) {
    const serverSecurityLvl = getServerSecurityLevel(hostName);
    const minimalSecurityLvl = getServerMinSecurityLevel(hostName);
    const chance = hackAnalyzeChance(hostName);
    print(`hack chances: ${chance} for ${hostName}`)

    await weaken(hostName)
    print(`security level: ${serverSecurityLvl} | min security level: ${minimalSecurityLvl}`)

    if (chance >= 0.4) {
      exec("smHack.js", hostName);
    }

    if (serverSecurityLvl < minimalSecurityLvl) {
      isNotWeak = false;
    }
  }

  ns.exec("smHack.js", host);

  atExit(() => {
    execAutoHacks(ns, hostName);
    print('at exit on weaken', hostName);
    closeTail(pid);
  })
}

/**
 * exec auto scripts
 * @param {NS} ns - NetScript API functions
 * @param {string} host - host name
 */
function execAutoHacks(ns, host) {
  ns.exec("smGrow.js", host);
  ns.exec("smHack.js", host);
}
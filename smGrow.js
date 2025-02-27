/** @param {NS} ns */
export async function main(ns) {
  const { getHostname, getServerMaxMoney, getServerMoneyAvailable, exec, grow, print, atExit, closeTail, pid} = ns;

  if (ns.args[0] === 'tail') {
    exec("tail.js", 'home', 1, ...[pid]);
  }

  const hostName = getHostname();
  let keepGrowing = true;

  exec("smWeaken.js", hostName);

  while (keepGrowing) {
    const availableMoney = getServerMoneyAvailable(hostName);
    const maxMoney = getServerMaxMoney(hostName)

    await grow(hostName)
    print(`server's available money: ${availableMoney} | server's max money: ${maxMoney}`)

    if (availableMoney >= 1000000 || availableMoney >= maxMoney) {
      keepGrowing = false;
    }
  }

  exec("smWeaken.js", hostName);

  atExit(() => {
    exec("smWeaken.js", hostName);

    print('at exit on grow', hostName)
    closeTail(pid);
  })
}
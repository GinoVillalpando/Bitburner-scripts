/** @param {NS} ns */
export async function main(ns) {
  const {
    getHostname,
    getServerMaxMoney,
    getServerMoneyAvailable,
    exec,
    grow,
    print,
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
  const weakenT = (Math.floor(ns.getServerMaxRam(hostName) / ns.getScriptRam("smWeaken.js")));
  let keepGrowing = true;

  while (keepGrowing) {
    const availableMoney = getServerMoneyAvailable(hostName);
    const maxMoney = getServerMaxMoney(hostName)

    await grow(hostName, { threads, stock: true })
    print(`server's available money: ${availableMoney} | server's max money: ${maxMoney}`)

    if (availableMoney >= 1000000 || availableMoney >= maxMoney) {
      keepGrowing = false;
    }
  }

  if (weakenT === 0) {
    spawn("smWeaken.js")
  } else {
    spawn("smWeaken.js", weakenT, ...[weakenT])
  }

  atExit(() => {
    closeTail(pid);
  })
}
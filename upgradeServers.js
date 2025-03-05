import { BudgetTracker } from './hacknet.js'

/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer, pid, exec, getPurchasedServers } = ns;
  const { money } = getPlayer();

  exec("tail.js", 'home', 1, ...[pid]);

  const decimalPercent = 0.05;

  let baseMoney = money;
  let remainingBalance = 0;


  const baseBudget = baseMoney * decimalPercent;
  let budgetTracker = new BudgetTracker(baseBudget);

  while (true) {
    const { money: newMoney } = getPlayer();
    const ownedServers = getPurchasedServers();

    let newBudget = newMoney * decimalPercent;
    const oneTenth = decimalPercent + decimalPercent;
    const doubleProfit = baseMoney + (baseMoney * oneTenth);


    if (newMoney >= doubleProfit) {
      budgetTracker.updateBudget(newBudget + remainingBalance);
      baseMoney = newMoney;
    }

    ns.print(` \n
      starting cash: $${ns.formatNumber(baseMoney)}
      current cash: $${ns.formatNumber(newMoney)}
      cash goal til next run: $${ns.formatNumber(doubleProfit)} \n 
    `);

    await ns.sleep(3000);
    await upgradeServers(ownedServers, ns, budgetTracker).then(() => {
      const { report, balance, expenses } = budgetTracker.generateOverallReport(ns);
      ns.print(`${report}`);

      if (balance > 0 && expenses > 0) {
        remainingBalance = balance;
      }
    })
  }
}


/**
 * 
 * @param {string[]} servers
 * @param {NS} ns - netscript
 * @param {BudgetTracker} budgetTracker
 * @returns {Promise<Promise[]>}
 */
async function upgradeServers(servers, ns, budgetTracker) {

  let serversToUpgrade = ns.getPurchasedServers().length;

  servers = servers.reverse();

  const serverPromises = servers.map((server) => {
    return new Promise((resolve) => {
      const ramOfCurrentServer = ns.getServerMaxRam(server);
      const runningScripts = ns.ps(server)


      if (ramOfCurrentServer >= ns.getPurchasedServerMaxRam()) {
        serversToUpgrade--
      }

      const ram = []

      for (let i = 0; i <= 20; i++) {
        ram.push(2 ** i);
      };

      const budget = serversToUpgrade > 0 ? budgetTracker.budget / serversToUpgrade : 0;
      budgetTracker.updateCategoryBudget(budget);


      for (const mem of ram) {

        if (mem > ramOfCurrentServer) {
          const upgradeCost = ns.getPurchasedServerUpgradeCost(server, mem);

          const { isWithinCategoryBudget, balance }
            = budgetTracker.checkCategoryBudget(upgradeCost, server);

          ns.print(`cost of ${mem} upgrade: $${ns.formatNumber(upgradeCost)} budget: $${ns.formatNumber(budget)} balance: $${ns.formatNumber(balance)}`)

          if (isWithinCategoryBudget === true) {
            budgetTracker.addExpense(upgradeCost, server)
            ns.upgradePurchasedServer(server, mem);

            for (const script of runningScripts) {
              if (script.filename === 'remoteHack.js') {
                ns.print('\n relaunching remoteHack.js... \n')
                ns.closeTail(script.pid);
                ns.kill(script.filename, server);
                ns.exec('shareScript.js', 'home');
              }
            }
          }

        }
      }

      resolve(server);
    })
  })

  return await Promise.all(serverPromises);
}
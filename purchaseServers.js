import { BudgetTracker } from './hacknet.js'

/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer, getPurchasedServerLimit, getPurchasedServers } = ns;
  const { money } = getPlayer();

  const serverBudget = new BudgetTracker(money * 0.11)
  const ram = []
  let serverPurchaseCount = 0;

  for (let i = 0; i <= 20; i++) {
    ram.push(2 ** i);
  };

  const serversLeft = () => {
    return getPurchasedServerLimit() - getPurchasedServers().length
  }

  for (const ramAmount of ram) {
    const purchaseServerCost = ns.getPurchasedServerCost(ramAmount);

    if ((purchaseServerCost <= money * 0.05 && purchaseServerCost >= 0.02) && ramAmount >= 64) {

      while (serverPurchaseCount < serversLeft()) {

        const serverName = `remote-hack-${ramAmount}-${serverPurchaseCount}`;

        serverBudget.addExpense(purchaseServerCost, serverName);
        ns.tprintf(serverBudget.generateOverallReport(ns).report)

        ns.purchaseServer(serverName, ramAmount);
        serverPurchaseCount++
        await ns.asleep(3000);
      }

    }
  }
}
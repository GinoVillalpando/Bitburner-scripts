import { BudgetTracker } from './hacknet.js'

/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer } = ns;
  const { money } = getPlayer();

  const serverBudget = new BudgetTracker(money * 0.11)
  let serverPurchaseCount = 0;
  const ram = []

  for (let i = 0; i <= 20; i++) {
    ram.push(2 ** i);
  };

  while (serverPurchaseCount < 5 && serverBudget.checkOverallBudget()) {

    await ns.asleep(300);
    for (const ramAmount of ram) {

      if (ramAmount === 64) {
        const purchaseServerCost = ns.getPurchasedServerCost(ramAmount);

        if (serverBudget.checkOverallBudget(purchaseServerCost)) {
          const serverName = 'remote-hack-64';

          serverBudget.addExpense(purchaseServerCost, serverName);
          ns.tprintf(serverBudget.generateOverallReport(serverName))

          // ns.purchaseServer(serverName, ramAmount);
          serverPurchaseCount++
        }
      }
    }
  }

  ns.tprint(serverBudget);
}
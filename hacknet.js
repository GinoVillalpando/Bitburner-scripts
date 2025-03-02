/**
 * Class that represents a simple budget tracker for expenses.
 */
export class BudgetTracker {
  /**
   * The starting total budget.
   * @private
   */
  budget = 0;
  /**
   * List of all expenses details.
   * @private
   */
  expenses = [];
  /**
   * Object maintaining spending information by category.
   * @private
   */
  spendingInfo = {};

  /**
   * Creates a budget tracker instance with a starting budget.
   * @param {number} budget - The initial budget.
   */
  constructor(budget) {
    this.budget = budget;
  }

  /**
   * Updates the total budget amount.
   * @param {number} amount - The new budget amount.
   */
  updateBudget(amount) {
    this.budget = amount;
  }

  /**
   * Records an expense and categorizes it.
   * @param {number} amount - Expense amount.
   * @param {string} category - Expense category.
   */
  addExpense(amount, category) {
    if (!this.spendingInfo[category]) {
      this.spendingInfo[category] = 0;
    }

    this.spendingInfo[category] += amount;
    this.expenses.push({ amount, category });
  }


  /**
   * Evaluates if overall expenses are within the current budget.
   * @returns {Record<string, boolean | number>} - object conatining the boolean value if within budget and the balance amount.
   */
  checkOverallBudget(amount = 0) {
    let totalExpenses = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    let evalualtion = this.budget - totalExpenses;

    return {
      isWithinOverallBudget: evalualtion - amount > 0,
      balance: evalualtion - amount
    };
  }


  /**
   * evaluates the budget of all the category expenses.
   * @returns {Record<string, boolean | number>} - object conatining the boolean value if within budget and the balance amount.
   */
  checkCategoryBudget(amount = 0, category, categoryBudget) {
    let totalExpenses = this.expenses.reduce((acc, expense) => expense.category === category ? acc + expense.amount : acc, 0);
    let evalualtion = categoryBudget - totalExpenses;

    return {
      isWithinCategoryBudget: evalualtion - amount > 0,
      balance: evalualtion - amount
    };
  }

  /**
   * Generates a report summarizing the expenses and remaining budget for a given category.
   * @param {NS} ns - NetScript API for using formatNumber()
   * @returns {string} - The summary report of the budget, expenses, and balance.
   */
  generateOverallReport(ns) {
    let totalExpenses = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    let balance = this.budget - totalExpenses;

    return `[Report] Budget: ${ns.formatNumber(this.budget)}, Expenses: ${ns.formatNumber(totalExpenses)}, Balance: ${ns.formatNumber(balance)}`;
  }
}

/**
 * The main function that simulates managing hacknet nodes through a budget tracker.
 * @param {NS} ns - Namespace object providing access to the scripting API.
 */
export async function main(ns) {
  const { hacknet, getPlayer, pid, exec } = ns;
  const { numNodes } = hacknet;
  const { money } = getPlayer();

  const decimalPercent = 0.05;

  let baseMoney = money;

  exec("tail.js", 'home', 1, ...[pid]);

  const baseBudget = baseMoney * decimalPercent;
  let loop = true;

  let budgetTracker = new BudgetTracker(baseBudget);

  while (loop) {
    const { money: newMoney } = getPlayer();

    const hacknetNodes = Array.from({ length: numNodes() }, (node, idx) => idx)
    let newBudget = newMoney * decimalPercent;

    if (newMoney >= baseMoney + (baseMoney * decimalPercent)) {
      budgetTracker.updateBudget(newBudget);
      baseMoney = newMoney;
    }

    ns.print(` \n
      new money: ${ns.formatNumber(newMoney)} \n
      base money: ${ns.formatNumber(baseMoney)} \n 
      money for next run: ${ns.formatNumber(baseMoney + (baseMoney * decimalPercent))} \n 
    `)

    await ns.asleep(3000);
    await upgradeNodes(hacknetNodes, ns, budgetTracker).then(() => {
      ns.print(`${budgetTracker.generateOverallReport(ns)}`);
    })
  }
}

/**
 * Asynchronously processes the upgrade of hacknet nodes and manages the budget for those upgrades.
 * @param {Array} hacknetNodes - An array of hacknet nodes indices to be upgraded.
 * @param {NS} ns - Namespace object providing access to the scripting API.
 * @param {BudgetTracker} baseBudgetTracker - base budget tracker for all node upgrades.
 * @returns {Promise<Array>} - A promise resolving to an array with the upgrade information.
 */
async function upgradeNodes(hacknetNodes, ns, baseBudgetTracker) {
  const { hacknet } = ns;
  const { getNodeStats, numNodes, upgradeLevel, upgradeRam, upgradeCore, getLevelUpgradeCost, getRamUpgradeCost, getCoreUpgradeCost } = hacknet;
  let nodesToUpgrade = numNodes();

  const hacknetPromises = hacknetNodes.map((nodeIdx) => {
    return new Promise((resolve) => {
      let partsToUpgrade = 3;
      const multi = 1;

      const nodeStats = getNodeStats(nodeIdx);
      const { level: levelStats, ram: ramStats, cores: coreStats } = nodeStats;

      let upgradeInfo = {
        level: {
          cost: getLevelUpgradeCost(nodeIdx, multi),
          loop: true,
          stats: levelStats,
        },
        ram: {
          cost: getRamUpgradeCost(nodeIdx, multi),
          loop: true,
          stats: ramStats,
        },
        cores: {
          cost: getCoreUpgradeCost(nodeIdx, multi),
          loop: true,
          stats: coreStats,
        }
      }

      if (levelStats >= 200 && ramStats >= 64 && coreStats >= 16) {
        nodesToUpgrade--
      }

      if (levelStats >= 200) {
        partsToUpgrade--
        delete upgradeInfo.level
      }

      if (ramStats >= 64) {
        partsToUpgrade--
        delete upgradeInfo.ram
      }

      if (coreStats >= 16) {
        partsToUpgrade--
        delete upgradeInfo.cores
      }

      ns.print(`nodes: ${numNodes()}`)

      // update budget after partsToUpgrade has been updated
      const budget = partsToUpgrade >= 1 && nodesToUpgrade >= 1
        ? baseBudgetTracker.budget / nodesToUpgrade / partsToUpgrade
        : 0;

      ns.print(`hacknet-node-${nodeIdx} upgrade budget for ${partsToUpgrade} part(s): ${ns.formatNumber(budget)} \n`);

      Object.keys(upgradeInfo).forEach((key) => {
        let upgrade = upgradeInfo[key];

        const upgradePart = () => {
          if (key === 'level') {
            upgradeLevel(nodeIdx, multi);
          } else if (key === 'ram') {
            upgradeRam(nodeIdx, multi);
          } else if (key === 'cores') {
            upgradeCore(nodeIdx, multi);
          }
        }

        while (upgrade.loop) {
          const { isWithinOverallBudget }
            = baseBudgetTracker.checkOverallBudget(upgrade.cost);

          const { isWithinCategoryBudget, balance }
            = baseBudgetTracker.checkCategoryBudget(upgrade.cost, `hacknet-node-${nodeIdx}-${key}`, budget);

          ns.print(`Balance for ${key}: ${ns.formatNumber(balance)}`)

          if (isWithinCategoryBudget && isWithinOverallBudget) {
            baseBudgetTracker.addExpense(upgrade.cost, `hacknet-node-${nodeIdx}-${key}`);
            upgradePart();
          } else {
            upgrade.loop = false;
          }
        }
      })

      resolve(upgradeInfo)
    })
  })

  return Promise.race(hacknetPromises);
}

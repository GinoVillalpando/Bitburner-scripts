/**
 * Class that represents a simple budget tracker for expenses.
 */
class BudgetTracker {
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
   * Checks if a given spending amount is within the budget without causing an overdraft.
   * @param {number} amount - The spending amount to check.
   * @returns {boolean} - True if the spending amount does not exceed the budget, false otherwise.
   */
  checkSpendingBudget(amount) {
    let evalualtion = this.budget - amount;
    // Compare category spending against budget
    return evalualtion > 0 && !(evalualtion < 0);
  }

  /**
   * Evaluates if overall expenses are within the current budget.
   * @returns {boolean} - True if the total expenses do not exceed the budget, otherwise false.
   */
  checkOverallBudget() {
    let totalExpenses = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);

    let evalualtion = this.budget - totalExpenses;

    return evalualtion > 0 && !(evalualtion < 0);
  }

  /**
   * Generates a report summarizing the expenses and remaining budget for a given category.
   * @param {string} category - The category for which to generate the report.
   * @returns {string} - The summary report of the budget, expenses, and balance.
   */
  generateOverallReport(category) {
    let totalExpenses = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    let balance = this.budget - totalExpenses;

    return `${category} Report: budget - ${this.budget}, Expenses - ${totalExpenses}, Balance - ${balance}`;
  }
}

/**
 * The main function that simulates managing hacknet nodes through a budget tracker.
 * @param {NS} ns - Namespace object providing access to the scripting API.
 */
export async function main(ns) {
  const { hacknet, tprint} = ns;
  const { numNodes } = hacknet;

  const hacknetNodes = Array.from({ length: numNodes() }, (node, idx) => idx)

  await upgradeNodes(hacknetNodes, ns).then((response) => {
    // response.forEach(({ upgradeInfo }) => {
    //   tprint(upgradeInfo.level.budgetTracker.generateOverallReport('level'));
    //   tprint(upgradeInfo.ram.budgetTracker.generateOverallReport('ram'));
    //   tprint(upgradeInfo.cores.budgetTracker.generateOverallReport('cores'));
    // })

    // tprint('No more upgrades can be done, exiting the loop.');
  })
}

/**
 * Asynchronously processes the upgrade of hacknet nodes and manages the budget for those upgrades.
 * @param {Array} hacknetNodes - An array of hacknet nodes indices to be upgraded.
 * @param {NS} ns - Namespace object providing access to the scripting API.
 * @returns {Promise<Array>} - A promise resolving to an array with the upgrade information.
 */
async function upgradeNodes(hacknetNodes, ns) {
  const { hacknet, getPlayer, tprintf } = ns;
  const { getNodeStats, numNodes, upgradeLevel, upgradeRam, upgradeCore, getLevelUpgradeCost, getRamUpgradeCost, getCoreUpgradeCost } = hacknet;

  const { money } = getPlayer();
  const nodesToUpgrade = numNodes();
  const baseBudget = money * 0.05;

  const hacknetPromises = hacknetNodes.map((nodeIdx) => {
    let partsToUpgrade = 3;
    let budget = 0;
    const multi = 5;

    const nodeStats = getNodeStats(nodeIdx);
    const { level: levelStats, ram: ramStats, cores: coreStats } = nodeStats;

    if (levelStats >= 200) {
      partsToUpgrade--
    }

    if (ramStats >= 64) {
      partsToUpgrade--
    }

    if (coreStats >= 16) {
      partsToUpgrade--
    }

    // update budget after partsToUpgrade has been updated
    budget = partsToUpgrade > 0 ? baseBudget / nodesToUpgrade / partsToUpgrade : baseBudget / nodesToUpgrade;

    // tprintf(`budget eval: ${budget} / ${nodesToUpgrade} / ${partsToUpgrade} = ${budget}`);

    let upgradeInfo = {
      level: {
        cost: getLevelUpgradeCost(nodeIdx, multi),
        budgetTracker: new BudgetTracker(budget),
        loop: true,
        stats: levelStats,
      },
      ram: {
        cost: getRamUpgradeCost(nodeIdx, multi),
        budgetTracker: new BudgetTracker(budget),
        loop: true,
        stats: ramStats,
      },
      cores: {
        cost: getCoreUpgradeCost(nodeIdx, multi),
        budgetTracker: new BudgetTracker(budget),
        loop: true,
        stats: coreStats
      }
    }

    Object.keys(upgradeInfo).forEach((key) => {
      let upgrade = upgradeInfo[key];

      const upgradePart = () => {
        if (key === 'level') {
          upgradeLevel(nodeIdx, multi);
        } else if (key === 'ram') {
          upgradeRam(nodeIdx, multi)
        } else if (key === 'cores') {
          upgradeCore(nodeIdx, multi)
        }
      }

      while (upgrade.loop) {
        const { budgetTracker, cost } = upgrade;
        const isSpendingWithinBudget = budgetTracker.checkSpendingBudget(cost);
        const isWithinOverallBudget = budgetTracker.checkOverallBudget();

        if (isSpendingWithinBudget && isWithinOverallBudget) {
          budgetTracker.addExpense(cost, key);
          upgradePart();
        } else {
          upgrade.loop = false;
        }
      }
    })

    return { upgradeInfo };
  })

  return await Promise.all(hacknetPromises)
}
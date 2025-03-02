/** @param {NS} ns */
export async function main(ns) {
  const { hacknet, getPlayer, tprintf } = ns;
  const { money } = getPlayer();
  const { getPurchaseNodeCost, purchaseNode } = hacknet;

  if (getPurchaseNodeCost() <= money * 0.025) {
    tprintf('purchasing node...');
    purchaseNode();
  }
}
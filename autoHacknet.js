/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer, exec, printf, hacknet, pid, share, formatNumber } = ns;
  let loop = true
  let hostName = ns.getHostname();

  exec("tail.js", 'home', 1, ...[pid]);

  if (ns.args.length === 0) {
    ns.args.push(5000000);
  }

  ns.disableLog('sleep');
  ns.disableLog('share');

  exec('hacknet.js', hostName);

  while (loop) {
    const { money } = getPlayer();
    const { numNodes, getPurchaseNodeCost, purchaseNode } = hacknet;
    const moneyForPurchase = money * 0.025
    const costForNextNode = getPurchaseNodeCost()

    await share();

    printf(`\n [RUN] owned nodes: ${numNodes()} \n requirements for next node: $${ns.formatNumber(moneyForPurchase)}/$${ns.formatNumber(costForNextNode)} \n`)

    if (money >= ns.args[0]) {
      if (costForNextNode <= moneyForPurchase) {
        purchaseNode();
      }
      await ns.sleep(3000);
    } else {
      printf(`unable to purchase or upgrade hacknet nodes due to insufficent funds: $${formatNumber(money)}/$${formatNumber(ns.args[0])}`)
    }
  }
}
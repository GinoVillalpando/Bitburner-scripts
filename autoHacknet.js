/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer, exec, printf, hacknet, pid, share, formatNumber } = ns;
  let loop = true
  let hostName = ns.getHostname();

  exec("tail.js", 'home', 1, ...[pid]);

  if (ns.args.length === 0) {
    ns.args.push(5000000);
  }

  exec('hacknet.js', hostName);
  ns.asleep(3000);

  while (loop) {
    const { money } = getPlayer();
    const { numNodes, maxNumNodes } = hacknet;

    await share();

    printf(`running auto hacknet - money available $${formatNumber(money, 2)} - purchased nodes: ${numNodes()} - max number nodes available: ${maxNumNodes()}`)

    if (money >= ns.args[0]) {
      await new Promise((resolve) => {
        ns.asleep(3000);
        exec('purchaseNodes.js', hostName);

        resolve('executed')
      })
    } else {
      printf(`unable to purchase or upgrade hacknet nodes due to insufficent funds: $${formatNumber(money, 2)}`)
    }
  }
}
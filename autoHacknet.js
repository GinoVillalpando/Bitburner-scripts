/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer, exec, printf, hacknet, pid, share, formatNumber} = ns;
  let loop = true

  exec("tail.js", 'home', 1, ...[pid]);

  if (ns.args.length === 0) {
    ns.args.push(5000000);
  }

  while (loop) {
    const { money } = getPlayer();
    const { numNodes, maxNumNodes } = hacknet;

    await share();

    printf(`running auto hacknet - money available $${formatNumber(money, 2)} - purchased nodes: ${numNodes()} - max number nodes available: ${maxNumNodes()}`)

    if (money >= ns.args[0]) {
      await new Promise((resolve) => {
        setTimeout(() => {
         exec('purchaseNodes.js', 'home');
        }, 3000)

        setTimeout(() => {
          exec('hacknet.js', 'home');
        }, 3000)

        setTimeout(() => {
          resolve('executed')

        }, 5000)
      })
    } else {
      printf(`unable to purchase or upgrade hacknet nodes due to insufficent funds: $${formatNumber(money, 2)}`)
    }
  }
}
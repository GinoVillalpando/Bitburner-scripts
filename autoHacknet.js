/** @param {NS} ns */
export async function main(ns) {
  const { getPlayer, exec, printf, hacknet, pid } = ns;

  exec("tail.js", 'home', 1, ...[pid]);

  if (ns.args.length === 0) {
    ns.args.push(5000000);
  }

  while (true) {
    const { money } = getPlayer();
    const { numNodes, maxNumNodes } = hacknet;

    printf(`running auto hacknet - money available ${money} - purchased nodes: ${numNodes()} - max number nodes available: ${maxNumNodes()}`)

    if (money >= ns.args[0]) {
      await new Promise((resolve) => {
        exec('purchaseNodes.js', 'home');

        setTimeout(() => {
          exec('hacknet.js', 'home');
        }, 3000)

        setTimeout(() => {
          resolve('executed')

        }, 5000)
      })
    }
  }
}
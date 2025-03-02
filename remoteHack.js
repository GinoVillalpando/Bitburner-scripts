/** 
 * Continously grow(), weaken(), and hack() on the networks I have access to
 * and display logging for the hack job but not for the scans or sleep functions
 * 
 * @param {NS} ns 
 */
export async function main(ns) {
  let alreadyVisited = new Set();

  ns.disableLog('asleep');
  ns.disableLog('scan');
  ns.exec('tail.js', 'home', 1, ...[ns.pid]);


  while (true) {
    alreadyVisited = new Set();
    await recursiveHack('home', alreadyVisited, ns);
  }
}

/**
 * recursive scan to get all neighbors and hack the networks we have access to
 * 
 * @param {String} currentServer - the currently visited server
 * @param {Set} visited - a Set() of the places visited
 * @param {NS} ns - Namespace object providing access to the scripting API.
 * @returns {Promise<Set>}
 */
export const recursiveHack = async (currentServer, visited, ns) => {
  visited.add(currentServer);

  const neighbors = ns.scan(currentServer);
  const threads = ns.args[0];

  for (const neighbor of neighbors) {
    const { purchasedByPlayer } = ns.getServer(neighbor);

    const isAccessible = !visited.has(neighbor) && ns.hasRootAccess(neighbor);
    const isHackable = ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(neighbor);

    if (isAccessible && isHackable && !purchasedByPlayer) {
      await ns.share();

      ns.print(`\n starting job on ${neighbor}... \n`);

      // perform hack procedures
      await ns.grow(neighbor, { threads });
      ns.getServerMoneyAvailable(neighbor);

      await ns.weaken(neighbor, { threads });
      await ns.hack(neighbor, { threads });

      await ns.asleep(300); // Ensuring a delay of 3000 ms between hackjob
      await recursiveHack(neighbor, visited, ns);
    }
  }

  return visited;
}
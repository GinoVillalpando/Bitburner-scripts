/** @param {NS} ns */
export async function main(ns) {

  ns.tprint(ns.getPurchasedServerLimit());
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

  for (const neighbor of neighbors) {
    const { purchasedByPlayer } = ns.getServer(neighbor);

    const isAccessible = !visited.has(neighbor) && ns.hasRootAccess(neighbor);
    const isHackable = ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(neighbor);

    if (isAccessible && isHackable && !purchasedByPlayer) {
      ns.print(`\n calculating max ram cost for ${neighbor}... \n`);
      const remoteHackRamCost = ns.getScriptRam('remoteHack.js');

      const moneyAvail = ns.formatNumber(ns.getServerMoneyAvailable(neighbor));
      const threads = ns.hackAnalyzeThreads(neighbor, moneyAvail);
      const maxHackThreads = Math.floor(Math.abs(threads));
      const ramCostForScriptsWithMaxThreads = remoteHackRamCost * maxHackThreads;

      ns.print(`ram: ${ns.formatRam(remoteHackRamCost)} threads: ${maxHackThreads} req ram: ${ns.formatRam(ramCostForScriptsWithMaxThreads)}`);

      await ns.asleep(3000); // Ensuring a delay of 3000 ms between hackjob
      await recursiveHack(neighbor, visited, ns);
    }
  }

  return visited;
}